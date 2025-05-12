import Individual from './Individual';
import Timetable from './Timetable';
import { IPopulation } from '../types/population.interface';

export default class Population implements IPopulation {
  population: Individual[] = [];
  populationFitness: number = -1;

  constructor(
    populationSize: number = 0,
    chromosomeLength: number | null = null,
    timetable: Timetable | null = null
  ) {
    if (populationSize <= 0) return;

    this.population = new Array(populationSize);

    if (timetable) {
      // Initialize with timetable
      for (let i = 0; i < populationSize; i++) {
        this.population[i] = new Individual(timetable);
      }
    } else if (chromosomeLength) {
      // Initialize with chromosome length
      for (let i = 0; i < populationSize; i++) {
        this.population[i] = new Individual(chromosomeLength);
      }
    } else {
      // Initialize with just population size
      this.population = [new Individual(populationSize)];
    }
  }

  getIndividuals(): Individual[] {
    return this.population;
  }

  getFittest(offset: number): Individual {
    this.population.sort((a, b) => b.fitness - a.fitness);
    return this.population[offset];
  }

  setPopulationFitness(fitness: number): void {
    this.populationFitness = fitness;
  }

  getPopulationFitness(): number {
    return this.populationFitness;
  }

  size(): number {
    return this.population.length;
  }

  setIndividual(offset: number, individual: Individual): Individual {
    return (this.population[offset] = individual);
  }

  getIndividual(offset: number): Individual {
    return this.population[offset];
  }

  shuffle(): void {
    for (let i = this.population.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.population[i], this.population[j]] = [this.population[j], this.population[i]];
    }
  }
}
