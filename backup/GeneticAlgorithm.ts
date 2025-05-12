import { Population } from './Population';
import { Individual } from './Individual  mutatePopulation(population: Population<T>): Population<T> {
    const newPopulation = new Population<T>(this.populationSize, this.problemDomain, false);

    for (let populationIndex = 0; populationIndex < population.size(); populationIndex++) {
      const individual = population.getFittest(populationIndex);

      // Only apply mutation if beyond elitism count
      if (populationIndex > this.elitismCount) {
        // Create a random individual for gene sampling
        const randomIndividual = this.problemDomain.createIndividual();

        // Loop over individual's genes
        for (let geneIndex = 0; geneIndex < individual.getChromosomeLength(); geneIndex++) {
          // Apply mutation based on mutation rate
          if (this.mutationRate > Math.random()) {
            individual.setGene(geneIndex, randomIndividual.getGene(geneIndex));
          }
        }
        
        // Validate the individual after mutation to ensure it meets problem constraints
        this.problemDomain.validateIndividual(individual);
      }mDomain } from './IProblemDomain';
import { IGeneticAlgorithm } from '../../types/core/genetic-algorithm.interface';

/**
 * Generic implementation of a Genetic Algorithm
 * This class handles the core GA operations independent of the problem domain
 * T is the type of gene in the chromosome
 * R is the type of the solution returned by the problem domain
 */
export class GeneticAlgorithm<T, R = unknown> implements IGeneticAlgorithm<T, R> {
  constructor(
    public populationSize: number,
    public mutationRate: number,
    public crossoverRate: number,
    public elitismCount: number,
    public tournamentSize: number,
    private problemDomain: IProblemDomain<T, R>
  ) {}

  /**
   * Initialize a population for the given problem domain
   */
  initPopulation(): Population<T> {
    return new Population<T>(this.populationSize, this.problemDomain);
  }

  /**
   * Check if the termination condition is met
   * @param population The current population
   * @returns true if the best fitness equals 1.0 (problem solved)
   */
  isTerminationConditionMet(population: Population<T>): boolean {
    return population.getFittest(0).getFitness() === 1.0;
  }

  /**
   * Calculate fitness for an individual based on the problem domain
   * @param individual The individual to evaluate
   * @returns Fitness value between 0.0 and 1.0
   */
  calcFitness(individual: Individual<T>): number {
    const fitness = this.problemDomain.calculateFitness(individual);
    individual.setFitness(fitness);
    return fitness;
  }

  /**
   * Evaluate the fitness of all individuals in a population
   * @param population The population to evaluate
   */
  evalPopulation(population: Population<T>): void {
    const populationFitness = population
      .getIndividuals()
      .reduce((fitness, individual: Individual<T>) => {
        return fitness + this.calcFitness(individual);
      }, 0);

    population.setPopulationFitness(populationFitness);
  }

  /**
   * Select a parent for crossover using tournament selection
   * @param population The population to select from
   * @returns The selected parent individual
   */
  selectParent(population: Population<T>): Individual<T> {
    const tournament = new Population<T>(this.tournamentSize, this.problemDomain, false);

    population.shuffle();
    for (let i = 0; i < this.tournamentSize; i++) {
      const tournamentIndividual = population.getIndividual(i);
      tournament.setIndividual(i, tournamentIndividual);
    }
    return tournament.getFittest(0);
  }

  /**
   * Apply mutation to the population
   * @param population The population to mutate
   * @returns A new population with mutations applied
   */
  mutatePopulation(population: Population<T>): Population<T> {
    const newPopulation = new Population<T>(this.populationSize, this.problemDomain, false);

    for (let populationIndex = 0; populationIndex < population.size(); populationIndex++) {
      const individual = population.getFittest(populationIndex);

      // Only apply mutation if beyond elitism count
      if (populationIndex > this.elitismCount) {
        // Create a random individual for gene sampling
        const randomIndividual = this.problemDomain.createIndividual();

        // Loop over individual's genes
        for (let geneIndex = 0; geneIndex < individual.getChromosomeLength(); geneIndex++) {
          // Apply mutation based on mutation rate
          if (this.mutationRate > Math.random()) {
            individual.setGene(geneIndex, randomIndividual.getGene(geneIndex));
          }
        }
        
        // Validate the individual to ensure it meets the problem constraints
        this.problemDomain.validateIndividual(individual);
      }

      newPopulation.setIndividual(populationIndex, individual);
    }
    return newPopulation;
  }

  /**
   * Apply crossover to the population
   * @param population The population for crossover
   * @returns A new population with crossover applied
   */
  crossoverPopulation(population: Population<T>): Population<T> {
    const newPopulation = new Population<T>(population.size(), this.problemDomain, false);

    for (let populationIndex = 0; populationIndex < population.size(); populationIndex++) {
      const parent1 = population.getFittest(populationIndex);

      if (this.crossoverRate > Math.random() && populationIndex >= this.elitismCount) {
        // Initialize offspring
        const offspring = this.problemDomain.createEmptyIndividual(parent1.getChromosomeLength());
        const parent2 = this.selectParent(population);

        // Crossover genes between parents
        for (let geneIndex = 0; geneIndex < parent1.getChromosomeLength(); geneIndex++) {
          offspring.setGene(
            geneIndex,
            Math.random() < 0.5 ? parent1.getGene(geneIndex) : parent2.getGene(geneIndex)
          );
        }
        
        // Validate the offspring to ensure it meets problem constraints
        this.problemDomain.validateIndividual(offspring);

        newPopulation.setIndividual(populationIndex, offspring);
      } else {
        newPopulation.setIndividual(populationIndex, parent1);
      }
    }
    return newPopulation;
  } /**
   * Run the genetic algorithm to solve a problem
   * @param maxGenerations Maximum number of generations to evolve
   * @returns The best individual found
   */
  evolve(maxGenerations: number = 1000): Individual<T> {
    // Initialize population
    let population = this.initPopulation();

    // Evaluate population
    this.evalPopulation(population);

    let generation = 1;

    // While termination condition not met and not reached max generations
    while (generation < maxGenerations && !this.isTerminationConditionMet(population)) {
      // Apply crossover
      population = this.crossoverPopulation(population);

      // Apply mutation
      population = this.mutatePopulation(population);

      // Evaluate population
      this.evalPopulation(population);

      generation++;
    }

    // Return the best solution found
    return population.getFittest(0);
  }

  /**
   * Get a decoded solution from the problem domain based on the best individual
   * @param individual The best individual to decode
   * @returns A solution specific to the problem domain
   */
  getSolution(individual: Individual<T>): R {
    return this.problemDomain.decodeSolution(individual);
  }
}
