import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { ProspectApi } from '../../../services/api/prospect-api';
import { Prospect, ProspectModel, ProspectSnapshotOut } from '../../entities/prospect/prospect';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const ProspectStoreModel = types
  .model('Prospect')
  .props({
    prospects: types.optional(types.array(ProspectModel), []),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getProspectsSuccess: (prospectSnapshotOuts: ProspectSnapshotOut[]) => {
      self.prospects.replace(prospectSnapshotOuts);
    },
  }))
  .actions(() => ({
    getProspectsFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    getProspects: flow(function* () {
      const prospectApi = new ProspectApi(self.environment.api);
      try {
        const getProspectsResult = yield prospectApi.getProspects(self.currentAccountHolder.id);
        self.getProspectsSuccess(getProspectsResult.prospects);
      } catch (e) {
        self.getProspectsFail(e.message);
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(() => ({
    saveProspectSuccess: (prospect: Prospect) => {
      __DEV__ && console.tron.log(prospect);
    },
  }))
  .actions(() => ({
    saveProspectFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    updateProspects: flow(function* (ahId, prospect: Prospect) {
      const prospectApi = new ProspectApi(self.environment.api);
      try {
        const UpdateProspectResult = yield prospectApi.updateProspects(ahId, prospect);
        self.saveProspectSuccess(UpdateProspectResult.prospect);
      } catch (e) {
        self.saveProspectFail(e.message);
        self.catchOrThrow(e);
      }
    }),
  }));

export interface ProspectStore extends Instance<typeof ProspectStoreModel> {}

export interface ProspectStoreSnapshotOut extends SnapshotOut<typeof ProspectStoreModel> {}

export interface ProspectStoreSnapshotIn extends SnapshotIn<typeof ProspectStoreModel> {}
