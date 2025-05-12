import { IIndividual } from '../../types/core/individual.interface';

/**
 * Generic Individual class for genetic algorithms
 * T is the type of gene in the chromosome (e.g., number, string, boolean, etc.)
 */
export class Individual<T> implements IIndividual<T> {
  chromosome: T[] = [];
  fitness: number = -1;

  /**
   * Constructor for Individual
   * @param chromosome Optional: Initial chromosome array
   */
  constructor(chromosome?: T[]) {
    if (chromosome) {
      this.chromosome = [...chromosome];
    }
  }

  /**
   * Get the entire chromosome
   */
  getChromosome(): T[] {
    return this.chromosome;
  }

  /**
   * Get the length of the chromosome
   */
  getChromosomeLength(): number {
    return this.chromosome.length;
  }

  /**
   * Set a gene at a specific position in the chromosome
   * @param offset The position to set
   * @param gene The gene value
   */
  setGene(offset: number, gene: T): void {
    this.chromosome[offset] = gene;
  }

  /**
   * Get a gene at a specific position in the chromosome
   * @param offset The position to get
   */
  getGene(offset: number): T {
    return this.chromosome[offset];
  }

  /**
   * Set the fitness value for this individual
   * @param fitness The fitness value (0.0 to 1.0)
   */
  setFitness(fitness: number): void {
    this.fitness = fitness;
  }

  /**
   * Get the current fitness value
   */
  getFitness(): number {
    return this.fitness;
  }

  /**
   * Convert the individual to a string representation
   */
  toString(): string {
    return this.chromosome.join(',');
  }

  /**
   * Check if the chromosome contains a specific gene
   * @param gene The gene to check for
   */
  containsGene(gene: T): boolean {
    return this.chromosome.includes(gene);
  }
}
