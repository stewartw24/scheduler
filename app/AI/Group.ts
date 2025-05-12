import { IGroup } from '../types/group.interface';

export default class Group implements IGroup {
  groupId: number;
  groupSize: number;
  moduleIds: number[];

  constructor(groupId: number, groupSize: number, moduleIds: number[]) {
    this.groupId = groupId;
    this.groupSize = groupSize;
    this.moduleIds = moduleIds;
  }

  getGroupId() {
    return this.groupId;
  }

  getGroupSize() {
    return this.groupSize;
  }

  getModuleIds() {
    return this.moduleIds;
  }
}
