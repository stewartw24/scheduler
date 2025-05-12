import { IIndividual } from '../types/individual.interface';
import Timetable from './Timetable';

export default class Individual implements IIndividual {
  chromosome: number[] = [];
  fitness: number = -1;

  constructor(param: Timetable | number[] | number) {
    if (Array.isArray(param)) {
      this.chromosome = param;
    } else if (param instanceof Timetable) {
      this.initFromTimetable(param);
    } else if (typeof param === 'number') {
      this.initWithLength(param);
    }
  }

  private initFromTimetable(timetable: Timetable): void {
    const numClasses = timetable.getNumClasses();
    const chromosomeLength = numClasses * 3;
    const newChromosome = new Array(chromosomeLength);
    let chromosomeIndex = 0;

    timetable.getGroupsAsArray().forEach((group) => {
      group.getModuleIds().forEach((moduleId) => {
        // Assign timeslot
        newChromosome[chromosomeIndex++] = timetable.getRandomTimeslot().getTimeslotId();

        // Assign room
        newChromosome[chromosomeIndex++] = timetable.getRandomRoom().getRoomId();

        // Assign professor
        newChromosome[chromosomeIndex++] = timetable.getModule(moduleId).getRandomProfessorId();
      });
    });

    this.chromosome = newChromosome;
  }

  private initWithLength(chromosomeLength: number): void {
    const individual = new Array(chromosomeLength);

    for (let gene = 0; gene < chromosomeLength; gene++) {
      individual[gene] = gene;
    }
    this.chromosome = individual;
  }

  getChromosome(): number[] {
    return this.chromosome;
  }

  getChromosomeLength(): number {
    return this.chromosome.length;
  }

  setGene(offset: number, gene: number): void {
    this.chromosome[offset] = gene;
  }

  getGene(offset: number): number {
    return this.chromosome[offset];
  }

  setFitness(fitness: number): void {
    this.fitness = fitness;
  }

  getFitness(): number {
    return this.fitness;
  }

  toString(): string {
    return this.chromosome.join(',');
  }

  containsGene(gene: number): boolean {
    return this.chromosome.includes(gene);
  }
}
