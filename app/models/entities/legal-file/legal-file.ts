import {types, Instance, SnapshotOut, SnapshotIn} from 'mobx-state-tree';

export const LegalFileModel = types.model('LegalFile').props({
  id: types.optional(types.string, ""),
  name: types.optional(types.string, ""),
  fileUrl: types.optional(types.string, ""),
  approvalDatetime: types.optional(types.string, ""),
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