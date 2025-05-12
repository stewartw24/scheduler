// filepath: /home/stewartw24/scheduler/app/AI/domains/tsp/TSPSolver.ts
import { GeneticAlgorithm } from '../../core/GeneticAlgorithm';
import { TSPProblemDomain, TSPSolution, City } from './TSPProblemDomain';
import { Individual } from '../../core/Individual';
import { Population } from '../../core/Population';

interface TSPResult {
  distance: number;
  path: string[]; // city names in order
  pathIds: number[]; // city ids in order
  computationTime: number; // in milliseconds
}

/**
 * Solver for the Traveling Salesman Problem using the genetic algorithm
 */
export class TSPSolver {
  /**
   * Perform ordered crossover (OX) for TSP
   * This maintains the relative order of cities while creating valid offspring
   */
  private orderedCrossover(
    parent1: Individual<number>,
    parent2: Individual<number>
  ): Individual<number> {
    const chromosomeLength = parent1.getChromosomeLength();
    const offspring = new Individual<number>();
    offspring.chromosome = new Array(chromosomeLength).fill(-1);

    // Select a subsequence from parent1
    const start = Math.floor(Math.random() * chromosomeLength);
    const end = start + Math.floor(Math.random() * (chromosomeLength - start));

    // Copy the selected subsequence from parent1 to offspring
    for (let i = start; i <= end; i++) {
      offspring.setGene(i, parent1.getGene(i));
    }

    // Fill the remaining positions from parent2, preserving order
    let currentParent2Pos = 0;
    for (let i = 0; i < chromosomeLength; i++) {
      // Skip positions already filled
      if (i >= start && i <= end) continue;

      // Find next city from parent2 that is not already in offspring
      let gene = parent2.getGene(currentParent2Pos);
      while (offspring.containsGene(gene)) {
        currentParent2Pos = (currentParent2Pos + 1) % chromosomeLength;
        gene = parent2.getGene(currentParent2Pos);
      }

      offspring.setGene(i, gene);
      currentParent2Pos = (currentParent2Pos + 1) % chromosomeLength;
    }

    return offspring;
  }

  /**
   * Perform swap mutation for TSP
   * Simply swaps two positions in the tour
   */
  private swapMutation(individual: Individual<number>, mutationRate: number): Individual<number> {
    const chromosomeLength = individual.getChromosomeLength();

    // Potentially apply multiple swaps based on mutation rate
    const numberOfSwaps = Math.ceil(mutationRate * chromosomeLength);

    for (let i = 0; i < numberOfSwaps; i++) {
      if (Math.random() < mutationRate) {
        // Select two random positions
        const pos1 = Math.floor(Math.random() * chromosomeLength);
        const pos2 = Math.floor(Math.random() * chromosomeLength);

        // Swap the cities
        const temp = individual.getGene(pos1);
        individual.setGene(pos1, individual.getGene(pos2));
        individual.setGene(pos2, temp);
      }
    }

    return individual;
  }

  /**
   * Solve a TSP instance using the genetic algorithm
   * @param cities The cities to visit
   * @param options Optional parameters for the algorithm
   * @returns The solution with the shortest path
   */
  solve(
    cities: City[],
    options = {
      populationSize: 100,
      mutationRate: 0.02,
      crossoverRate: 0.9,
      elitismCount: 2,
      tournamentSize: 5,
      maxGenerations: 1000,
    }
  ): TSPResult {
    const startTime = Date.now();

    // Create the problem domain
    const tspProblem = new TSPProblemDomain(cities);

    // Create and configure the genetic algorithm
    const ga = new GeneticAlgorithm<number, TSPSolution>(
      options.populationSize,
      options.mutationRate,
      options.crossoverRate,
      options.elitismCount,
      options.tournamentSize,
      tspProblem
    );

    // Initialize population
    let population = ga.initPopulation();

    // Evaluate population
    ga.evalPopulation(population);

    let generation = 1;

    // While termination condition not met and not reached max generations
    while (generation < options.maxGenerations && !ga.isTerminationConditionMet(population)) {
      // Create a new population for this generation
      const newPopulation = new Population<number>(population.size(), tspProblem, false);
      
      // Apply elitism - keep the best individuals
      for (let i = 0; i < options.elitismCount; i++) {
        newPopulation.setIndividual(i, population.getFittest(i));
      }
      
      // Apply crossover and mutation to fill the rest of the population
      for (let i = options.elitismCount; i < population.size(); i++) {
        // Select parents
        const parent1 = ga.selectParent(population);
        
        // Apply crossover?
        if (Math.random() < options.crossoverRate) {
          const parent2 = ga.selectParent(population);
          // Use ordered crossover for permutation chromosomes
          const offspring = this.orderedCrossover(parent1, parent2);
          
          // Apply mutation to the offspring
          this.swapMutation(offspring, options.mutationRate);
          
          // Add to new population
          newPopulation.setIndividual(i, offspring);
        } else {
          // No crossover, just mutate the parent
          const offspring = new Individual<number>();
          offspring.chromosome = [...parent1.getChromosome()];
          
          // Apply mutation
          this.swapMutation(offspring, options.mutationRate);
          
          // Add to new population
          newPopulation.setIndividual(i, offspring);
        }
      }
      
      // Update the population
      population = newPopulation;
      
      // Evaluate the new population
      ga.evalPopulation(population);
      
      generation++;
    }

    // Get the best solution found
    const bestIndividual = population.getFittest(0);
    
    // Get the solution using the getSolution method
    const solution = ga.getSolution(bestIndividual);

    const endTime = Date.now();

    // Return the formatted result
    return {
      distance: solution.distance,
      path: solution.path.map((city) => city.name),
      pathIds: solution.path.map((city) => city.id),
      computationTime: endTime - startTime,
    };
  }
}
