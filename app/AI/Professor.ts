import { IProfessor } from '../types/professor.interface';

export default class Professor implements IProfessor {
  professorId: number;
  professorName: string;

  constructor(professorId: number, professorName: string) {
    this.professorId = professorId;
    this.professorName = professorName;
  }

  getProfessorId() {
    return this.professorId;
  }

  getProfessorName() {
    return this.professorName;
  }
}
