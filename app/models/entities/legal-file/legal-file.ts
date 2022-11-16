import {types, Instance, SnapshotOut, SnapshotIn} from 'mobx-state-tree';

export const LegalFileModel = types.model('LegalFile').props({
  id: types.string,
  name: types.string,
  fileUrl: types.string,
  approvalDatetime: types.string,
});

export interface LegalFile extends Instance<typeof LegalFileModel>{}
export interface LegalFileSnapshotOut extends SnapshotOut<typeof LegalFileModel> {}
export interface LegalFileSnapshotIn extends SnapshotIn<typeof LegalFileModel> {}

export const createLegalFileDefaultModel = () =>
  types.optional(LegalFileModel, {
    id: "",
    name: "",
    fileUrl: "",
    approvalDatetime: "",
  });