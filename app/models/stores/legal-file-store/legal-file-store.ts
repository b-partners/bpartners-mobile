import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { withEnvironment, withRootStore } from '../..';
import { LegalFileApi } from '../../../services/api/legal-file-api';
import { LegalFileModel, LegalFileSnapshotOut } from '../../entities/legal-file/legal-file';
import { withCredentials } from '../../extensions/with-credentials';

export const LegalFileStoreModel = types
  .model('LegalFiles')
  .props({
    legalFiles: types.optional(types.array(LegalFileModel), []),
  })
  .extend(withRootStore)
  .extend(withCredentials)
  .extend(withEnvironment)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getLegalFileSuccess: (legalFiles: LegalFileSnapshotOut[]) => {
      self.legalFiles.replace(legalFiles);
    },
  }))
  .actions(self => ({
    getLegalFileFail: error => {
      __DEV__ && console.tron.log(`${error}`);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getLegalFiles: flow(function* () {
      const legalFileApi = new LegalFileApi(self.environment.api);
      try {
        const result = yield legalFileApi.getLegalFiles(self.currentUser.id);
        self.getLegalFileSuccess(result.legalFiles);
      } catch (e) {
        self.getLegalFileFail(e);
        // self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => {
    const fileIndexById = (id: string) => self.legalFiles.findIndex(file => file.id === id);
    const approveLegalFileSuccess = flow(function* (approvedLegalFile: LegalFileSnapshotOut) {
      // replace the unapproved file to the approved one
      // to avoid low latency internet connection
      const fileIndex = fileIndexById(approvedLegalFile.id);
      self.legalFiles[fileIndex] = approvedLegalFile;

      // double check legalFiles
      self.getLegalFiles();
    });

    return { approveLegalFileSuccess };
  })
  .actions(() => ({
    approveLegalFileFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    approveLegalFile: flow(function* (lId: string) {
      const legalFileApi = new LegalFileApi(self.environment.api);
      try {
        const { legalFile } = yield legalFileApi.approveLegalFiles(self.currentUser.id, lId);
        self.approveLegalFileSuccess(legalFile);
      } catch (e) {
        self.approveLegalFileFail(e);
        self.catchOrThrow(e);
      }
    }),
  }))
  .views(self => ({
    get unApprovedFiles() {
      return self.legalFiles.filter(legalFile => !legalFile.approvalDatetime);
    },
  }));

export interface LegalFileStore extends Instance<typeof LegalFileStoreModel> {}

export interface LegalFileStoreSnapshotOut extends SnapshotOut<typeof LegalFileStoreModel> {}

export interface LegalFileStoreSnapshotIn extends SnapshotIn<typeof LegalFileStoreModel> {}

export const createLegalFileStoreDefaultModel = () =>
  types.optional(LegalFileStoreModel, {
    legalFiles: [],
  });
