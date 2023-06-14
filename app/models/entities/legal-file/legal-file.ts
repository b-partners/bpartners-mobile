import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const LegalFileModel = types.model('LegalFile').props({
  id: types.maybe(types.maybeNull(types.string)),
  name: types.maybe(types.maybeNull(types.string)),
  fileUrl: types.maybe(types.maybeNull(types.string)),
  approvalDatetime: types.maybe(types.maybeNull(types.string)),
  toBeConfirmed: types.maybe(types.maybeNull(types.boolean)),
});

export interface LegalFile extends Instance<typeof LegalFileModel> {}
export interface LegalFileSnapshotOut extends SnapshotOut<typeof LegalFileModel> {}
export interface LegalFileSnapshotIn extends SnapshotIn<typeof LegalFileModel> {}

export const createLegalFileDefaultModel = () =>
  types.optional(LegalFileModel, {
    id: '',
    name: '',
    fileUrl: '',
    approvalDatetime: '',
    toBeConfirmed: false,
  });
