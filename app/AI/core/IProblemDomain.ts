import { Individual } from './Individual';

/**
 * Interface for problem domains that can be solved with the genetic algorithm
 * T is the type of gene used in the chromosome (e.g., number, string, boolean, etc.)
 * R is the type of the solution returned by decodeSolution
 */
export interface IProblemDomain<T, R = unknown> {
  /**
   * Create a new individual with randomly initialized genes
   * @returns A randomly initialized individual
   */
  createIndividual(): Individual<T>;

  /**
   * Create an empty individual with uninitialized genes of specified length
   * @param chromosomeLength The length of the chromosome
   * @returns An empty individual
   */
  createEmptyIndividual(chromosomeLength: number): Individual<T>;

  /**
   * Calculate the fitness of an individual
   * @param individual The individual to evaluate
   * @returns A fitness value between 0.0 and 1.0
   */
  calculateFitness(individual: Individual<T>): number;

  /**
   * Apply any problem-specific validation or repair to an individual
   * @param individual The individual to validate/repair
   * @returns The validated/repaired individual
   */
  validateIndividual(individual: Individual<T>): Individual<T>;

  /**
   * Convert the best individual into a solution in the problem domain
   * @param bestIndividual The best individual found by the algorithm
   * @returns A solution in the problem domain's format
   */
  decodeSolution(bestIndividual: Individual<T>): R;
}
