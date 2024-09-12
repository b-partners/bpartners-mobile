import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { ProspectApi } from '../../../services/api/prospect-api';
import { ProspectFilter } from '../../entities/filter/filter';
import { Prospect, ProspectModel, ProspectStatus } from '../../entities/prospect/prospect';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const ProspectStoreModel = types
  .model('Prospect')
  .props({
    prospects: types.optional(types.array(ProspectModel), []),
    loadingProspect: types.optional(types.boolean, false),
    hasNext: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getProspectsSuccess: (prospectSnapshotOuts: Prospect[]) => {
      self.prospects.replace(prospectSnapshotOuts as any);
    },
  }))
  .actions(self => ({
    getProspectsFail: error => {
      __DEV__ && console.tron.log(error.message);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getProspects: flow(function* (filter: ProspectFilter & { page?: number; perPage?: number; status?: ProspectStatus }) {
      self.loadingProspect = true;
      const prospectApi = new ProspectApi(self.environment.api);
      const { page, perPage, status, name } = filter;
      try {
        const getProspectsResult = yield prospectApi.getProspects(self.currentAccountHolder.id, { name }, page, perPage, status);
        self.getProspectsSuccess(getProspectsResult.prospects);
        self.hasNext = getProspectsResult.hasNext;
      } catch (e) {
        self.getProspectsFail(e);
      } finally {
        self.loadingProspect = false;
      }
    }),
  }))
  .actions(() => ({
    saveProspectSuccess: (prospect: Prospect) => {
      __DEV__ && console.tron.log(prospect);
    },
  }))
  .actions(self => ({
    saveProspectFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    updateProspects: flow(function* (id: string, prospect: Prospect) {
      const prospectApi = new ProspectApi(self.environment.api);
      try {
        const UpdateProspectResult = yield prospectApi.updateProspects(self.currentAccountHolder.id, id, prospect);
        self.saveProspectSuccess(UpdateProspectResult.prospect);
      } catch (e) {
        self.saveProspectFail(e);
      }
    }),
  }))
  .actions(self => ({
    creationProspect: flow(function* (prospect: Prospect) {
      const prospectApi = new ProspectApi(self.environment.api);
      try {
        const createdProspect = yield prospectApi.createProspect(self.currentAccountHolder.id, prospect);
        self.saveProspectSuccess(createdProspect.prospect);
      } catch (e) {
        self.saveProspectFail(e);
      }
    }),
  }));

export interface ProspectStore extends Instance<typeof ProspectStoreModel> {}

export interface ProspectStoreSnapshotOut extends SnapshotOut<typeof ProspectStoreModel> {}

export interface ProspectStoreSnapshotIn extends SnapshotIn<typeof ProspectStoreModel> {}
