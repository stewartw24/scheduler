/**
 * Interface for an Individual in a genetic algorithm
 * T is the type of gene in the chromosome
 */
export interface IIndividual<T> {
  chromosome: T[];
  fitness: number;

  getChromosome(): T[];
  getChromosomeLength(): number;
  setGene(offset: number, gene: T): void;
  getGene(offset: number): T;
  setFitness(fitness: number): void;
  getFitness(): number;
}
