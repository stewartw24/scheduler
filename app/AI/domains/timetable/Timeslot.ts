/**
 * Class representing a timeslot in the timetable
 */
export class Timeslot {
  constructor(
    private timeslotId: number,
    private timeslot: string
  ) {}

  getTimeslotId(): number {
    return this.timeslotId;
  }

  getTimeslot(): string {
    return this.timeslot;
  }
}
