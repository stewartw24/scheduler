import { ITimeslot } from '../types/timeslot.interface';

export default class Timeslot implements ITimeslot {
  timeslotId: number;
  timeslot: string;

  constructor(timeslotId: number, timeslot: string) {
    this.timeslotId = timeslotId;
    this.timeslot = timeslot;
  }

  getTimeslotId() {
    return this.timeslotId;
  }

  getTimeslot() {
    return this.timeslot;
  }
}
