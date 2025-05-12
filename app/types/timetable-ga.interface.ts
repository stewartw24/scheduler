/**
 * Interface for TimetableGA class input data
 */
export interface TimetableInputData {
  rooms: RoomData[];
  timeslots: TimeslotData[];
  professors: ProfessorData[];
  modules: ModuleData[];
  groups: GroupData[];
}

/**
 * Interface for TimetableGA class output data
 */
export interface TimetableResultData {
  class: number;
  moduleName: string;
  groupId: number;
  groupSize: number;
  roomNumber: string;
  roomCapacity: number;
  professor: string;
  time: string;
}

// Sub-interfaces for the input data
export interface RoomData {
  roomId: number;
  roomNumber: string;
  capacity: number;
}

export interface TimeslotData {
  timeslotId: number;
  timeslot: string;
}

export interface ProfessorData {
  professorId: number;
  professorName: string;
}

export interface ModuleData {
  moduleId: number;
  moduleCode: string;
  module: string;
  professorIds: number[];
}

export interface GroupData {
  groupId: number;
  groupSize: number;
  moduleIds: number[];
}
