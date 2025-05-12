import { IProblemDomain } from '../../core/IProblemDomain';
import { Individual } from '../../core/Individual';

export interface City {
  id: number;
  x: number;
  y: number;
  name: string;
}

export interface TSPSolution {
  distance: number;
  path: City[];
}

/**
 * Problem domain implementation for the Traveling Salesman Problem
 */
export class TSPProblemDomain implements IProblemDomain<number, TSPSolution> {
  /**
   * Constructor for TSPProblemDomain
   * @param cities Array of cities in the problem
   */
  constructor(private cities: City[]) {}

  /**
   * Create a new individual with a random tour of cities
   * @returns A randomly initialized individual
   */
  createIndividual(): Individual<number> {
    const individual = new Individual<number>();
    const chromosomeLength = this.cities.length;

    // Initialize chromosome with cities' indices (0 to n-1)
    const chromosome = Array.from({ length: chromosomeLength }, (_, i) => i);

    // Shuffle the chromosome (Fisher-Yates algorithm)
    for (let i = chromosome.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chromosome[i], chromosome[j]] = [chromosome[j], chromosome[i]];
    }

    individual.chromosome = chromosome;
    return individual;
  }

  /**
   * Create an empty individual with uninitialized genes of specified length
   * @param chromosomeLength The length of the chromosome
   * @returns An empty individual
   */
  createEmptyIndividual(chromosomeLength: number): Individual<number> {
    const individual = new Individual<number>();
    individual.chromosome = new Array(chromosomeLength).fill(-1);
    return individual;
  }

  /**
   * Calculate the fitness of an individual for the TSP
   * @param individual The individual to evaluate
   * @returns A fitness value between 0.0 and 1.0 (higher is better)
   */
  calculateFitness(individual: Individual<number>): number {
    const totalDistance = this.calculateTotalDistance(individual);

    // Convert distance to fitness (shorter distance = higher fitness)
    // Using a scaling approach to keep fitness between 0 and 1
    const maxPossibleDistance = 10000; // Adjust based on your problem scale
    const normalizedDistance = Math.min(totalDistance, maxPossibleDistance) / maxPossibleDistance;

    // Invert so shorter distances have higher fitness (closer to 1.0)
    return 1.0 - normalizedDistance;
  }

  /**
   * Calculate the total distance of a tour
   * @param individual The individual (tour) to evaluate
   * @returns The total distance of the tour
   */
  private calculateTotalDistance(individual: Individual<number>): number {
    const chromosome = individual.getChromosome();
    let totalDistance = 0;

    // Calculate distance between consecutive cities in the tour
    for (let i = 0; i < chromosome.length; i++) {
      const cityAIndex = chromosome[i];
      const cityBIndex = chromosome[(i + 1) % chromosome.length]; // Wrap around to the first city

      // Ensure both indices are valid
      if (
        cityAIndex < 0 ||
        cityAIndex >= this.cities.length ||
        cityBIndex < 0 ||
        cityBIndex >= this.cities.length
      ) {
        return Number.MAX_VALUE; // Return a very large distance for invalid tours
      }

      const cityA = this.cities[cityAIndex];
      const cityB = this.cities[cityBIndex];

      // Calculate Euclidean distance
      const distance = Math.sqrt(Math.pow(cityA.x - cityB.x, 2) + Math.pow(cityA.y - cityB.y, 2));

      totalDistance += distance;
    }

    return totalDistance;
  }

  /**
   * Validate a TSP tour (ensure it's a permutation of city indices)
   * @param individual The individual to validate/repair
   * @returns The validated/repaired individual
   */
  validateIndividual(individual: Individual<number>): Individual<number> {
    const chromosome = individual.getChromosome();
    const cityCount = this.cities.length;

    // Check if all city indices appear exactly once
    const visited = new Set<number>();
    const cityIndicesFromChromosome = new Set<number>();
    const duplicates = [];
    const missing = [];

    // Find duplicates and missing city indices
    for (let i = 0; i < chromosome.length; i++) {
      const cityIndex = chromosome[i];
      if (cityIndex >= 0 && cityIndex < cityCount) {
        if (visited.has(cityIndex)) {
          duplicates.push(i);
        } else {
          visited.add(cityIndex);
        }
        cityIndicesFromChromosome.add(cityIndex);
      } else {
        // Invalid index (out of range)
        duplicates.push(i);
      }
    }

    // Find missing city indices
    for (let i = 0; i < cityCount; i++) {
      if (!cityIndicesFromChromosome.has(i)) {
        missing.push(i);
      }
    }

    // If valid, return as is
    if (duplicates.length === 0 && missing.length === 0 && chromosome.length === cityCount) {
      return individual;
    }

    // Fix invalid tour by replacing duplicates with missing cities
    if (duplicates.length > 0 && missing.length > 0) {
      for (let i = 0; i < Math.min(duplicates.length, missing.length); i++) {
        individual.setGene(duplicates[i], missing[i]);
      }
    }

    // If still invalid, create a completely new valid permutation
    if (visited.size !== cityCount || chromosome.length !== cityCount) {
      const validChromosome = Array.from({ length: cityCount }, (_, i) => i);
      for (let i = validChromosome.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [validChromosome[i], validChromosome[j]] = [validChromosome[j], validChromosome[i]];
      }
      individual.chromosome = validChromosome;
    }

    return individual;
  }

  /**
   * Convert the best individual into a solution
   * @param bestIndividual The best individual found by the algorithm
   * @returns A solution with the shortest path and total distance
   */
  decodeSolution(bestIndividual: Individual<number>): TSPSolution {
    // First, validate the individual to ensure it's a valid tour
    const validatedIndividual = this.validateIndividual(bestIndividual);
    const chromosome = validatedIndividual.getChromosome();

    // Map chromosome indices to actual city objects
    const path = chromosome.map((cityIndex) => {
      // Ensure the index is within bounds
      if (cityIndex >= 0 && cityIndex < this.cities.length) {
        return this.cities[cityIndex];
      }

      // Default to the first city if index is invalid
      console.error(`Invalid city index: ${cityIndex}`);
      return this.cities[0];
    });

    const distance = this.calculateTotalDistance(validatedIndividual);

    return {
      distance,
      path,
    };
  }
}
