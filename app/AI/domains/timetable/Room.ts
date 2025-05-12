/**
 * Class representing a room in the timetable
 */
export class Room {
  constructor(
    private roomId: number,
    private roomNumber: string,
    private capacity: number
  ) {}

  getRoomId(): number {
    return this.roomId;
  }

  getRoomNumber(): string {
    return this.roomNumber;
  }

  getRoomCapacity(): number {
    return this.capacity;
  }
}
