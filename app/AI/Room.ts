import { IRoom } from '../types/room.interface';

export default class Room implements IRoom {
  roomId: number;
  roomNumber: string;
  capacity: number;

  constructor(roomId: number, roomNumber: string, capacity: number) {
    this.roomId = roomId;
    this.roomNumber = roomNumber;
    this.capacity = capacity;
  }

  getRoomId() {
    return this.roomId;
  }

  getRoomNumber() {
    return this.roomNumber;
  }

  getRoomCapacity() {
    return this.capacity;
  }
}
