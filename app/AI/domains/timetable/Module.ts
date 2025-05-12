/**
 * Class representing a module (course) in the timetable
 */
export class Module {
  constructor(
    private moduleId: number,
    private moduleCode: string,
    private moduleName: string,
    private professorIds: number[]
  ) {}

  getModuleId(): number {
    return this.moduleId;
  }

  getModuleCode(): string {
    return this.moduleCode;
  }

  getModuleName(): string {
    return this.moduleName;
  }

  getProfessorIds(): number[] {
    return this.professorIds;
  }

  getRandomProfessorId(): number {
    return this.professorIds[Math.floor(Math.random() * this.professorIds.length)];
  }
}
