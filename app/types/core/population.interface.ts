import { Individual } from '../../AI/core/Individual';

/**
 * Interface for a Population in a genetic algorithm
 * T is the type of gene in the individuals' chromosomes
 */
export interface IPopulation<T> {
  population: Individual<T>[];
  populationFitness: number;

  getIndividuals(): Individual<T>[];
  getFittest(offset: number): Individual<T>;
  setPopulationFitness(fitness: number): void;
  getPopulationFitness(): number;
  size(): number;
  setIndividual(offset: number, individual: Individual<T>): Individual<T>;
  getIndividual(offset: number): Individual<T>;
  shuffle(): void;
}
