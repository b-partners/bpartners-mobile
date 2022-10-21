import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const FileModel = types.model('File').props({
  id: types.maybe(types.identifier),
  uploadedAt: types.maybe(types.string),
  uploadedByUserId: types.maybe(types.string),
  sizeInKB: types.maybe(types.integer),
  sha256: types.maybe(types.string),
});

export interface File extends Instance<typeof FileModel> {}

export interface FileSnapshotOut extends SnapshotOut<typeof FileModel> {}

export interface FileSnapshotIn extends SnapshotIn<typeof FileModel> {}

export const createFileDefaultModel = () =>
  types.optional(FileModel, {
    id: null,
    uploadedAt: null,
    uploadedByUserId: null,
    sizeInKB: null,
    sha256: null,
  });
