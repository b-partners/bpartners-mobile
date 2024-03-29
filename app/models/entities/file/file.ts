import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const FileIdModel = types.model('FileId').props({
  fileId: types.maybeNull(types.string),
});
export const FileModel = types.model('File').props({
  id: types.maybe(types.maybeNull(types.string)),
  uploadedAt: types.maybe(types.maybeNull(types.string)),
  uploadedByUserId: types.maybe(types.maybeNull(types.string)),
  sizeInKB: types.maybe(types.maybeNull(types.integer)),
  sha256: types.maybe(types.maybeNull(types.string)),
});

export interface File extends Instance<typeof FileModel> {}
export interface FileId extends Instance<typeof FileIdModel> {}

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
