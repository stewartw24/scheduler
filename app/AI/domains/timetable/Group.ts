/**
 * Class representing a student group in the timetable
 */
export class Group {
  constructor(
    private groupId: number,
    private groupSize: number,
    public moduleIds: number[]
  ) {}

  getGroupId(): number {
    return this.groupId;
  }

  getGroupSize(): number {
    return this.groupSize;
  }

  getModuleIds(): number[] {
    return this.moduleIds;
  }
}
