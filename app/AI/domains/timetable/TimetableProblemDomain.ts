import { IProblemDomain } from '../../core/IProblemDomain';
import { Individual } from '../../core/Individual';
import { Timetable } from './Timetable';
import { TimetableResultData } from '../../../types/timetable-ga.interface';
import { Class } from './Class';

/**
 * An implementation of the IProblemDomain interface for the timetable scheduling problem
 */
export class TimetableProblemDomain implements IProblemDomain<number, TimetableResultData[]> {
  /**
   * Constructor for TimetableProblemDomain
   * @param timetable The timetable data model
   */
  constructor(private timetable: Timetable) {}

  /**
   * Create a new individual with randomly initialized genes for the timetable problem
   * @returns A randomly initialized individual
   */
  createIndividual(): Individual<number> {
    const individual = new Individual<number>();
    const chromosome: number[] = [];
    let chromosomeIndex = 0;

    this.timetable.getGroupsAsArray().forEach((group) => {
      group.getModuleIds().forEach((moduleId) => {
        // Assign timeslot
        chromosome[chromosomeIndex++] = this.timetable.getRandomTimeslot().getTimeslotId();

        // Assign room
        chromosome[chromosomeIndex++] = this.timetable.getRandomRoom().getRoomId();

        // Assign professor
        chromosome[chromosomeIndex++] = this.timetable.getModule(moduleId).getRandomProfessorId();
      });
    });

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
    individual.chromosome = new Array(chromosomeLength).fill(0);
    return individual;
  }

  /**
   * Calculate the fitness of an individual for the timetable problem
   * @param individual The individual to evaluate
   * @returns A fitness value between 0.0 and 1.0
   */
  calculateFitness(individual: Individual<number>): number {
    // Create a copy of the timetable for this fitness calculation
    const threadTimetable = new Timetable(this.timetable);

    // Create classes based on the chromosome
    threadTimetable.createClasses(individual);

    // Calculate clashes (lower clashes = better fitness)
    const clashes = threadTimetable.calcClashes();

    // Calculate fitness (1 / (1 + clashes)) so that 0 clashes = fitness of 1.0
    const fitness = 1 / (clashes + 1);

    return fitness;
  }

  /**
   * Apply any problem-specific validation or repair to an individual
   * @param individual The individual to validate/repair
   * @returns The validated/repaired individual
   */
  validateIndividual(individual: Individual<number>): Individual<number> {
    // For timetable, we don't need special validation
    // All randomly generated genes are valid (any timeslot, room, or professor ID)
    return individual;
  }

  /**
   * Convert the best individual into a timetable solution
   * @param bestIndividual The best individual found by the algorithm
   * @returns A timetable solution in a structured format
   */
  decodeSolution(bestIndividual: Individual<number>): TimetableResultData[] {
    // Create classes based on the chromosome
    this.timetable.createClasses(bestIndividual);

    // Convert the classes to a result format
    return this.timetable.getClasses().map((bestClass: Class, index: number) => {
      const group = this.timetable.getGroup(bestClass.getGroupId());
      const room = this.timetable.getRoom(bestClass.getRoomId());

      return {
        class: index + 1,
        moduleName: this.timetable.getModule(bestClass.getModuleId()).getModuleName(),
        groupId: group.getGroupId(),
        groupSize: group.getGroupSize(),
        roomNumber: room.getRoomNumber(),
        roomCapacity: room.getRoomCapacity(),
        professor: this.timetable.getProfessor(bestClass.getProfessorId()).getProfessorName(),
        time: this.timetable.getTimeslot(bestClass.getTimeslotId()).getTimeslot(),
      } as TimetableResultData;
    });
  }
}
