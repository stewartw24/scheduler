/**
 * Class representing a professor in the timetable
 */
export class Professor {
  constructor(
    private professorId: number,
    private professorName: string
  ) {}

  getProfessorId(): number {
    return this.professorId;
  }

  getProfessorName(): string {
    return this.professorName;
  }
}
