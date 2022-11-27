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
  .actions(() => ({
    getLegalFileFail: error => {
      __DEV__ && console.tron.log(`${error}`);
    },
  }))
  .actions(self => ({
    getLegalFiles: flow(function* () {
      const legalFileApi = new LegalFileApi(self.environment.api);
      try {
        const result = yield legalFileApi.getLegalFiles(self.currentUser.id);
        self.getLegalFileSuccess(result.legalFiles);
      } catch (e) {
        self.getLegalFileFail(e.message);
        // self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    approveLegalFileSuccess: () => {
      // get the updated legal file and replace
      // the legalFile on the store to the new one
      self.getLegalFiles();
    },
  }))
  .actions(() => ({
    approveLegalFileFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    approveLegalFile: flow(function* (lId: string) {
      const legalFileApi = new LegalFileApi(self.environment.api);
      try {
        yield legalFileApi.approveLegalFiles(self.currentUser.id, lId);
        self.approveLegalFileSuccess();
      } catch (e) {
        self.approveLegalFileFail(e.message);
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
