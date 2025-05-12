import { Population } from '../../AI/core/Population';
import { Individual } from '../../AI/core/Individual';

/**
 * Interface for a generic Genetic Algorithm
 * T is the type of gene in the chromosome
 * R is the type of the solution returned by the problem domain
 */
export interface IGeneticAlgorithm<T, R = unknown> {
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  elitismCount: number;
  tournamentSize: number;

  /**
   * Initialize a population
   */
  initPopulation(): Population<T>;

  /**
   * Check if the termination condition is met
   */
  isTerminationConditionMet(population: Population<T>): boolean;

  /**
   * Calculate fitness for an individual
   */
  calcFitness(individual: Individual<T>): number;

  /**
   * Evaluate the fitness of all individuals in a population
   */
  evalPopulation(population: Population<T>): void;

  /**
   * Select a parent for crossover
   */
  selectParent(population: Population<T>): Individual<T>;

  /**
   * Apply mutation to the population
   */
  mutatePopulation(population: Population<T>): Population<T> /**
   * Apply crossover to the population
   */;
  crossoverPopulation(population: Population<T>): Population<T>;

  /**
   * Run the genetic algorithm to find a solution
   * @param maxGenerations Maximum number of generations to evolve
   * @returns The best individual found
   */
  evolve(maxGenerations?: number): Individual<T>;

  /**
   * Get a decoded solution from the problem domain based on the best individual
   * @param individual The best individual to decode
   * @returns A solution specific to the problem domain
   */
  getSolution(individual: Individual<T>): R;
}
