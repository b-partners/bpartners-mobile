import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { Log } from '../../../screens/welcome/utils/utils';
import { GeojsonApi } from '../../../services/api/geojson-api';
import { Geojson, GeojsonModel } from '../../entities/geojson/geojson';
import { Points } from '../../entities/points/points';
import { withCredentials } from '../../extensions/with-credentials';
import { withGeojsonEnvironment } from '../../extensions/with-geojson-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const GeojsonStoreModel = types
  .model('Bank')
  .props({
    geojson: types.maybeNull(GeojsonModel),
  })
  .extend(withRootStore)
  .extend(withGeojsonEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    convertPointSuccess: (geojson: Geojson) => {
      self.geojson = geojson;
    },
  }))
  .actions(self => ({
    convertPoints: flow(function* (points: Points) {
      const geojsonApi = new GeojsonApi(self.environment.api);
      try {
        const convertPointResult = yield geojsonApi.convertPoints(points);
        Log(convertPointResult.geojson);
      } catch (e) {
        self.catchOrThrow(e);
      }
    }),
  }));

export interface GeojsonStore extends Instance<typeof GeojsonStoreModel> {}

export interface GeojsonStoreSnapshotOut extends SnapshotOut<typeof GeojsonStoreModel> {}

export interface GeojsonStoreSnapshotIn extends SnapshotIn<typeof GeojsonStoreModel> {}
