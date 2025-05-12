import Individual from '../AI/Individual';

export interface IPopulation {
  population: Individual[];
  populationFitness: number;
}
