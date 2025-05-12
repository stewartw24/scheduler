import { GeneticAlgorithm } from '../../core/GeneticAlgorithm';
import { Timetable } from './Timetable';
import { TimetableProblemDomain } from './TimetableProblemDomain';
import { TimetableInputData, TimetableResultData } from './types/timetable-ga.interface';

/**
 * Class that handles the timetable scheduling using the genetic algorithm
 */
export class TimetableGA {
  /**
   * Convert input data to a Timetable object
   * @param data The input data for the timetable
   * @returns A configured Timetable instance
   */
  private tableData(data: TimetableInputData): Timetable {
    const timetable = new Timetable();

    // Add rooms
    data.rooms.forEach((room) => timetable.addRoom(room.roomId, room.roomNumber, room.capacity));

    // Add timeslots
    data.timeslots.forEach((timeslot) =>
      timetable.addTimeslot(timeslot.timeslotId, timeslot.timeslot)
    );

    // Add professors
    data.professors.forEach((professor) =>
      timetable.addProfessor(professor.professorId, professor.professorName)
    );

    // Add modules
    data.modules.forEach((module) =>
      timetable.addModule(module.moduleId, module.moduleCode, module.module, module.professorIds)
    );

    // Add groups
    data.groups.forEach((group) =>
      timetable.addGroup(group.groupId, group.groupSize, group.moduleIds)
    );

    return timetable;
  }

  /**
   * Initialize and run the genetic algorithm to generate a timetable
   * @param data The input data for the timetable
   * @returns A timetable solution
   */
  initAI(data: TimetableInputData): TimetableResultData[] {
    // Create the timetable from input data
    const timetable = this.tableData(data);

    // Create a problem domain for the timetable
    const timetableProblem = new TimetableProblemDomain(timetable);

    // Configure the genetic algorithm
    const ga = new GeneticAlgorithm<number, TimetableResultData[]>(
      100, // populationSize
      0.01, // mutationRate
      0.9, // crossoverRate
      2, // elitismCount
      5, // tournamentSize
      timetableProblem
    );

    // Run the algorithm with maximum 1000 generations
    const bestIndividual = ga.evolve(1000);

    // Decode the solution using the getSolution method
    return ga.getSolution(bestIndividual);
  }
}
