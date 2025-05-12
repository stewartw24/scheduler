import Room from './Room';
import Professor from './Professor';
import Module from './Module';
import Timeslot from './TimeSlot';
import Group from './Group';
import Class from './Class';
import { ITimetable } from '../types/timetable.interface';
import Individual from './Individual';

export default class Timetable implements ITimetable {
  rooms: Map<number, Room>;
  professors: Map<number, Professor>;
  modules: Map<number, Module>;
  groups: Map<number, Group>;
  timeslots: Map<number, Timeslot>;
  classes: Class[] = [];
  numClasses: number = 0;

  constructor(cloneable?: Timetable) {
    if (cloneable) {
      this.rooms = cloneable.getRooms();
      this.professors = cloneable.getProfessors();
      this.modules = cloneable.getModules();
      this.groups = cloneable.getGroups();
      this.timeslots = cloneable.getTimeslots();
      this.numClasses = cloneable.numClasses;
    } else {
      this.rooms = new Map<number, Room>();
      this.professors = new Map<number, Professor>();
      this.modules = new Map<number, Module>();
      this.groups = new Map<number, Group>();
      this.timeslots = new Map<number, Timeslot>();
    }
  }

  getGroups(): Map<number, Group> {
    return this.groups;
  }

  getTimeslots(): Map<number, Timeslot> {
    return this.timeslots;
  }

  getModules(): Map<number, Module> {
    return this.modules;
  }

  getProfessors(): Map<number, Professor> {
    return this.professors;
  }

  addRoom(roomId: number, roomName: string, capacity: number): void {
    this.rooms.set(roomId, new Room(roomId, roomName, capacity));
  }

  addProfessor(professorId: number, professorName: string): void {
    this.professors.set(professorId, new Professor(professorId, professorName));
  }

  addModule(moduleId: number, moduleCode: string, module: string, professorIds: number[]): void {
    this.modules.set(moduleId, new Module(moduleId, moduleCode, module, professorIds));
  }

  addGroup(groupId: number, groupSize: number, moduleIds: number[]): void {
    this.groups.set(groupId, new Group(groupId, groupSize, moduleIds));
    this.numClasses = 0;
  }

  addTimeslot(timeslotId: number, timeslot: string): void {
    this.timeslots.set(timeslotId, new Timeslot(timeslotId, timeslot));
  }

  createClasses(individual: Individual): void {
    const classes = new Array(this.getNumClasses());
    const chromosome = individual.getChromosome();
    let chromosomePos = 0;
    let classIndex = 0;

    const groupsArr = this.getGroupsAsArray();

    groupsArr.forEach((group) => {
      const moduleIds = group.getModuleIds();
      moduleIds.forEach((moduleId) => {
        classes[classIndex] = new Class(classIndex, group.getGroupId(), moduleId);
        classes[classIndex].addTimeslot(chromosome[chromosomePos]);
        chromosomePos++;
        classes[classIndex].setRoomId(chromosome[chromosomePos]);
        chromosomePos++;
        classes[classIndex].addProfessor(chromosome[chromosomePos]);
        chromosomePos++;
        classIndex++;
      });
    });
    this.classes = classes;
  }

  getRoom(roomId: number): Room {
    if (!this.rooms.has(roomId)) {
      console.log("Rooms doesn't contain key " + roomId);
    }
    return this.rooms.get(roomId) as Room;
  }

  getRooms(): Map<number, Room> {
    return this.rooms;
  }

  getRandomRoom(): Room {
    const roomsArray = Array.from(this.rooms.values());
    return roomsArray[Math.floor(Math.random() * roomsArray.length)];
  }

  getProfessor(professorId: number): Professor {
    return this.professors.get(professorId) as Professor;
  }

  getModule(moduleId: number): Module {
    return this.modules.get(moduleId) as Module;
  }

  getGroupModules(groupId: number): number[] {
    const group = this.groups.get(groupId) as Group;
    return group.getModuleIds();
  }

  getGroup(groupId: number): Group {
    return this.groups.get(groupId) as Group;
  }

  getGroupsAsArray(): Group[] {
    return Array.from(this.groups.values());
  }

  getTimeslot(timeslotId: number): Timeslot {
    return this.timeslots.get(timeslotId) as Timeslot;
  }

  getRandomTimeslot(): Timeslot {
    const timeslotArray = Array.from(this.timeslots.values());
    return timeslotArray[Math.floor(Math.random() * timeslotArray.length)];
  }

  getClasses(): Class[] {
    return this.classes;
  }

  getNumClasses(): number {
    if (this.numClasses > 0) {
      return this.numClasses;
    }

    this.numClasses = Array.from(this.groups.values()).reduce(
      (sum, group) => sum + group.moduleIds.length,
      0
    );

    return this.numClasses;
  }

  calcClashes(): number {
    let clashes = 0;

    // Check room capacity constraints
    for (const classA of this.classes) {
      const roomCapacity = this.getRoom(classA.getRoomId()).getRoomCapacity();
      const groupSize = this.getGroup(classA.getGroupId()).getGroupSize();

      if (roomCapacity < groupSize) {
        clashes++;
      }
    }

    const roomTimeslotMap = new Map<string, Set<number>>();
    const professorTimeslotMap = new Map<string, Set<number>>();

    for (const classItem of this.classes) {
      const roomTimeslotKey = `${classItem.getTimeslotId()}_${classItem.getRoomId()}`;
      const profTimeslotKey = `${classItem.getTimeslotId()}_${classItem.getProfessorId()}`;

      // Check room-timeslot clashes
      if (!roomTimeslotMap.has(roomTimeslotKey)) {
        roomTimeslotMap.set(roomTimeslotKey, new Set<number>());
      }
      const roomClasses = roomTimeslotMap.get(roomTimeslotKey)!;
      if (roomClasses.size > 0) {
        clashes++;
      }
      roomClasses.add(classItem.getClassId());

      // Check professor-timeslot clashes
      if (!professorTimeslotMap.has(profTimeslotKey)) {
        professorTimeslotMap.set(profTimeslotKey, new Set<number>());
      }
      const profClasses = professorTimeslotMap.get(profTimeslotKey)!;
      if (profClasses.size > 0) {
        clashes++;
      }
      profClasses.add(classItem.getClassId());
    }

    return clashes;
  }
}
