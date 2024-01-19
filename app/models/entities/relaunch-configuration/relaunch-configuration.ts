import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const RelaunchConfigurationModel = types.model('RelaunchConfiguration').props({
  id: types.maybe(types.maybeNull(types.string)),
  unpaidRelaunch: types.maybe(types.maybeNull(types.number)),
  draftRelaunch: types.maybe(types.maybeNull(types.number)),
  updatedAt: types.maybe(types.maybeNull(types.string)),
});

export interface RelaunchConfiguration extends Instance<typeof RelaunchConfigurationModel> {}

export interface RelaunchConfigurationSnapshotOut extends SnapshotOut<typeof RelaunchConfigurationModel> {}

export interface RelaunchConfigurationSnapshotIn extends SnapshotIn<typeof RelaunchConfigurationModel> {}

export const createRelaunchConfigurationDefaultModel = () => types.optional(RelaunchConfigurationModel, {});
