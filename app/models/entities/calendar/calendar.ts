import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const CalendarModel = types.model('Calendar').props({
  id: types.maybeNull(types.string),
  summary: types.maybeNull(types.string),
  permission: types.maybeNull(types.string),
});

export interface Calendar extends Instance<typeof CalendarModel> {}

export interface CalendarSnapshotOut extends SnapshotOut<typeof CalendarModel> {}

export interface CalendarSnapshotIn extends SnapshotIn<typeof CalendarModel> {}
