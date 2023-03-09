import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';
import {ProspectModel, ProspectSnapshotOut} from "../../entities/prospect/prospect";
import {ProspectApi} from "../../../services/api/prospect-api";

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
  }));

export interface ProspectStore extends Instance<typeof ProspectStoreModel> {}

export interface ProspectStoreSnapshotOut extends SnapshotOut<typeof ProspectStoreModel> {}

export interface ProspectStoreSnapshotIn extends SnapshotIn<typeof ProspectStoreModel> {}
