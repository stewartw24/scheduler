/**
 * Class representing a class allocation in the timetable (the scheduling unit)
 */
export class Class {
  private timeslotId: number = -1;
  private roomId: number = -1;
  private professorId: number = -1;

  constructor(
    private classId: number,
    private groupId: number,
    private moduleId: number
  ) {}

  getClassId(): number {
    return this.classId;
  }

  getGroupId(): number {
    return this.groupId;
  }

  getModuleId(): number {
    return this.moduleId;
  }

  addTimeslot(timeslotId: number): void {
    this.timeslotId = timeslotId;
  }

  getTimeslotId(): number {
    return this.timeslotId;
  }

  setRoomId(roomId: number): void {
    this.roomId = roomId;
  }

  getRoomId(): number {
    return this.roomId;
  }

  addProfessor(professorId: number): void {
    this.professorId = professorId;
  }

  getProfessorId(): number {
    return this.professorId;
  }
}
