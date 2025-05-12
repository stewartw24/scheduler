import { GeneticAlgorithm } from './core/GeneticAlgorithm';
import Timetable from './Timetable';
import { TimetableInputData, TimetableResultData } from '../types/timetable-ga.interface';
import { TimetableProblemDomain } from './domains/timetable/TimetableProblemDomain';

// Create adapter to convert between old Timetable and new domain-specific Timetable
import { Timetable as DomainTimetable } from './domains/timetable/Timetable';

export default class TimetableGA {
  private tableData(data: TimetableInputData): Timetable {
    const timetable = new Timetable();

    data.rooms.forEach((room) => timetable.addRoom(room.roomId, room.roomNumber, room.capacity));

    data.timeslots.forEach((timeslot) =>
      timetable.addTimeslot(timeslot.timeslotId, timeslot.timeslot)
    );

    data.professors.forEach((professor) =>
      timetable.addProfessor(professor.professorId, professor.professorName)
    );

    data.modules.forEach((module) =>
      timetable.addModule(module.moduleId, module.moduleCode, module.module, module.professorIds)
    );

    data.groups.forEach((group) =>
      timetable.addGroup(group.groupId, group.groupSize, group.moduleIds)
    );

    return timetable;
  }

  // Convert legacy Timetable to domain Timetable
  private convertToDomainTimetable(timetable: Timetable): DomainTimetable {
    const domainTimetable = new DomainTimetable();

    // Add rooms
    Array.from(timetable.getRooms().values()).forEach((room) => {
      domainTimetable.addRoom(room.getRoomId(), room.getRoomNumber(), room.getRoomCapacity());
    });

    // Add timeslots
    Array.from(timetable.getTimeslots().values()).forEach((timeslot) => {
      domainTimetable.addTimeslot(timeslot.getTimeslotId(), timeslot.getTimeslot());
    });

    // Add professors
    Array.from(timetable.getProfessors().values()).forEach((professor) => {
      domainTimetable.addProfessor(professor.getProfessorId(), professor.getProfessorName());
    });

    // Add modules
    Array.from(timetable.getModules().values()).forEach((module) => {
      domainTimetable.addModule(
        module.getModuleId(),
        module.getModuleCode(),
        module.getModuleName(),
        module.professorIds
      );
    });

    // Add groups
    timetable.getGroupsAsArray().forEach((group) => {
      domainTimetable.addGroup(group.getGroupId(), group.getGroupSize(), group.getModuleIds());
    });

    return domainTimetable;
  }

  initAI(data: TimetableInputData): TimetableResultData[] {
    // Use the original tableData method for backward compatibility
    const timetable = this.tableData(data);

    // Convert to domain-specific Timetable
    const domainTimetable = this.convertToDomainTimetable(timetable);

    // Create a problem domain for the timetable
    const timetableProblem = new TimetableProblemDomain(domainTimetable);

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

    // Get the solution using the decodeSolution method of the problem domain
    return timetableProblem.decodeSolution(bestIndividual);
  }
}
