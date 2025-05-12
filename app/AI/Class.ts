import { IClass } from '../types/class.interface';

export default class Class implements IClass {
  classId: number;
  groupId: number;
  moduleId: number;
  professorId!: number;
  timeslotId!: number;
  roomId!: number;

  constructor(classId: number, groupId: number, moduleId: number) {
    this.classId = classId;
    this.moduleId = moduleId;
    this.groupId = groupId;
  }

  addProfessor(professorId: number): void {
    this.professorId = professorId;
  }

  addTimeslot(timeslotId: number): void {
    this.timeslotId = timeslotId;
  }

  setRoomId(roomId: number): void {
    this.roomId = roomId;
  }

  getClassId(): number {
    return this.classId;
  }

  getGroupId(): number {
    return this.groupId;
  }

  getModuleId(): number {
    return this.moduleId;
  }

  getProfessorId(): number {
    return this.professorId;
  }

  getTimeslotId(): number {
    return this.timeslotId;
  }

  getRoomId(): number {
    return this.roomId;
  }
}
