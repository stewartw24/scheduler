import { IModule } from '../types/module.interface';

export default class Module implements IModule {
  constructor(
    public moduleId: number,
    public moduleCode: string,
    public module: string,
    public professorIds: number[]
  ) {}

  getModuleId(): number {
    return this.moduleId;
  }

  getModuleCode(): string {
    return this.moduleCode;
  }

  getModuleName(): string {
    return this.module;
  }

  getRandomProfessorId(): number {
    if (this.professorIds.length === 0) {
      return 0;
    }

    return this.professorIds[Math.floor(Math.random() * this.professorIds.length)];
  }
}
