import { Individual } from './Individual';
import { IProblemDomain } from './IProblemDomain';
import { IPopulation } from '../../types/core/population.interface';

/**
 * Generic Population class for genetic algorithms
 * T is the type of gene in the individuals' chromosomes
 */
export class Population<T> implements IPopulation<T> {
  population: Individual<T>[] = [];
  populationFitness: number = -1;

  /**
   * Constructor for Population
   * @param populationSize Size of the population or an array of individuals
   * @param problemDomain The problem domain for creating individuals
   * @param initialize Whether to initialize random individuals (default: true)
   */
  constructor(
    populationSize: number | Individual<T>[] = 0,
    private problemDomain?: IProblemDomain<T>,
    initialize: boolean = true
  ) {
    if (Array.isArray(populationSize)) {
      // If passed an array of individuals
      this.population = [...populationSize];
      return;
    }

    if (populationSize <= 0) return;

    this.population = new Array(populationSize);

    if (initialize && problemDomain) {
      // Initialize with random individuals
      for (let i = 0; i < populationSize; i++) {
        this.population[i] = problemDomain.createIndividual();
      }
    }
  }

  /**
   * Get all individuals in the population
   */
  getIndividuals(): Individual<T>[] {
    return this.population;
  }

  /**
   * Get the fittest individual with the specified offset
   * @param offset Position of the individual in the sorted population
   */
  getFittest(offset: number): Individual<T> {
    this.population.sort((a, b) => b.getFitness() - a.getFitness());
    return this.population[offset];
  }

  /**
   * Set the fitness of the entire population
   * @param fitness The total fitness value
   */
  setPopulationFitness(fitness: number): void {
    this.populationFitness = fitness;
  }

  /**
   * Get the fitness of the entire population
   */
  getPopulationFitness(): number {
    return this.populationFitness;
  }

  /**
   * Get the size of the population
   */
  size(): number {
    return this.population.length;
  }

  /**
   * Set an individual at a specific position in the population
   * @param offset The position to set
   * @param individual The individual to insert
   */
  setIndividual(offset: number, individual: Individual<T>): Individual<T> {
    return (this.population[offset] = individual);
  }

  /**
   * Get an individual at a specific position in the population
   * @param offset The position to get
   */
  getIndividual(offset: number): Individual<T> {
    return this.population[offset];
  }

  /**
   * Shuffle the population (used in selection)
   */
  shuffle(): void {
    for (let i = this.population.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.population[i], this.population[j]] = [this.population[j], this.population[i]];
    }
  }
}
