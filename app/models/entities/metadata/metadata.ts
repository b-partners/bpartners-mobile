import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const MetadataModel = types.model('MetadataModel').props({
  submittedAt: types.maybe(types.maybeNull(types.Date)),
});

export interface Metadata extends Instance<typeof MetadataModel> {}

export interface MetadataSnapshotOut extends SnapshotOut<typeof MetadataModel> {}

export interface MetadataSnapshotIn extends SnapshotIn<typeof MetadataModel> {}

export const createMetadataDefaultModel = () => types.optional(MetadataModel, {});
