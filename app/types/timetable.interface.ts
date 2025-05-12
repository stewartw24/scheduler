import { IRoom } from './room.interface';
import { IProfessor } from './professor.interface';
import { IModule } from './module.interface';
import { IGroup } from './group.interface';
import { ITimeslot } from './timeslot.interface';
import { IClass } from './class.interface';

export interface ITimetable {
  rooms: Map<number, IRoom>;
  professors: Map<number, IProfessor>;
  modules: Map<number, IModule>;
  groups: Map<number, IGroup>;
  timeslots: Map<number, ITimeslot>;
  classes: IClass[];
  numClasses: number;
}
