import { Room } from './Room';
import { Professor } from './Professor';
import { Module } from './Module';
import { Timeslot } from './Timeslot';
import { Group } from './Group';
import { Class } from './Class';
import { Individual } from '../../core/Individual';

/**
 * Class representing a timetable with all its components
 */
export class Timetable {
  private rooms: Map<number, Room>;
  private professors: Map<number, Professor>;
  private modules: Map<number, Module>;
  private groups: Map<number, Group>;
  private timeslots: Map<number, Timeslot>;
  private classes: Class[] = [];
  private numClasses: number = 0;

  /**
   * Constructor for Timetable
   * @param cloneable Optional: Timetable to clone
   */
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

  /**
   * Add a room to the timetable
   */
  addRoom(roomId: number, roomName: string, capacity: number): void {
    this.rooms.set(roomId, new Room(roomId, roomName, capacity));
  }

  /**
   * Add a professor to the timetable
   */
  addProfessor(professorId: number, professorName: string): void {
    this.professors.set(professorId, new Professor(professorId, professorName));
  }

  /**
   * Add a module to the timetable
   */
  addModule(moduleId: number, moduleCode: string, module: string, professorIds: number[]): void {
    this.modules.set(moduleId, new Module(moduleId, moduleCode, module, professorIds));
  }

  /**
   * Add a group to the timetable
   */
  addGroup(groupId: number, groupSize: number, moduleIds: number[]): void {
    this.groups.set(groupId, new Group(groupId, groupSize, moduleIds));
    this.numClasses = 0; // Reset numClasses when groups change
  }

  /**
   * Add a timeslot to the timetable
   */
  addTimeslot(timeslotId: number, timeslot: string): void {
    this.timeslots.set(timeslotId, new Timeslot(timeslotId, timeslot));
  }

  /**
   * Create classes based on an individual's chromosome
   */
  createClasses(individual: Individual<number>): void {
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

  /**
   * Calculate clashes in the timetable
   * @returns Number of constraint violations
   */
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

    // Check room and timeslot clashes and professor and timeslot clashes
    // Using a map to track occupied rooms and professors in each timeslot
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

  // Getter methods
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

  getProfessors(): Map<number, Professor> {
    return this.professors;
  }

  getModule(moduleId: number): Module {
    return this.modules.get(moduleId) as Module;
  }

  getModules(): Map<number, Module> {
    return this.modules;
  }

  getGroup(groupId: number): Group {
    return this.groups.get(groupId) as Group;
  }

  getGroups(): Map<number, Group> {
    return this.groups;
  }

  getGroupsAsArray(): Group[] {
    return Array.from(this.groups.values());
  }

  getTimeslot(timeslotId: number): Timeslot {
    return this.timeslots.get(timeslotId) as Timeslot;
  }

  getTimeslots(): Map<number, Timeslot> {
    return this.timeslots;
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
}
