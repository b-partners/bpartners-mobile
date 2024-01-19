import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const CalendarModel = types.model('Calendar').props({
  id: types.maybeNull(types.string),
  summary: types.maybeNull(types.string),
  permission: types.maybeNull(types.string),
});

export const EventModel = types.model('Event').props({
  summary: types.maybeNull(types.string),
  organizer: types.maybeNull(types.string),
  location: types.maybeNull(types.string),
  from: types.maybeNull(types.string),
  id: types.maybeNull(types.string),
  to: types.maybeNull(types.string),
  participants: types.optional(types.array(types.string), []),
  isSynchronized: types.maybeNull(types.boolean),
  updatedAt: types.maybeNull(types.string),
});

export interface Calendar extends Instance<typeof CalendarModel> {}

export interface Event extends Instance<typeof EventModel> {}

export interface CalendarSnapshotOut extends SnapshotOut<typeof CalendarModel> {}

export interface CalendarSnapshotIn extends SnapshotIn<typeof CalendarModel> {}
