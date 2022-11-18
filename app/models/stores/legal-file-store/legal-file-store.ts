import {flow} from 'mobx-state-tree';
import {LegalFileModel, LegalFileSnapshotOut} from '../../entities/legal-file/legal-file';
import {LegalFileApi} from '../../../services/api/legal-file-api';
import {withEnvironment} from '../../extensions/with-environment';
import {withRootStore} from '../../extensions/with-root-store';
import {withCredentials} from '../../extensions/with-credentials';


export const LegalFileStoreModel = LegalFileModel
  .extend(withRootStore)
  .extend(withCredentials)
  .extend(withEnvironment)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getLegalFileSuccess: (legalFile: LegalFileSnapshotOut) => {
      self.id = legalFile.id;
      self.name = legalFile.name;
      self.fileUrl = legalFile.fileUrl;
      self.approvalDatetime = legalFile.approvalDatetime;
    },
  }))
  .actions(() => ({
    getLegalFileFail: error => {
      __DEV__ && console.tron.log(`${error}`);
    },
  }))
  .actions(self => ({
    getLegalFile: flow(function* () {
      const legalFileApi = new LegalFileApi(self.environment.api);
      try {
        const result = yield legalFileApi.getLegalFiles(self.currentUser.id);
        const { ...legalFile } = result;
        self.getLegalFileSuccess(legalFile);
      } catch (e) {
        self.getLegalFileFail(e.message);
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    approveLegalFileSuccess: () => {
      // get the updated legal file and replace
      // the legalFile on the store to the new one
      self.getLegalFile();
    },
  }))
  .actions(() => ({
    approveLegalFileFail: (error) => {
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
;
