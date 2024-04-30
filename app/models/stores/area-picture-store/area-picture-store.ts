import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { AreaPictureApi } from '../../../services/api/area-picture-api';
import { Annotation, AnnotationModel } from '../../entities/annotation/annotation';
import { AreaPicture, AreaPictureModel } from '../../entities/area-picture/area-picture';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const AreaPictureStoreModel = types
  .model('Bank')
  .props({
    areaPicture: types.maybeNull(AreaPictureModel),
    annotation: types.maybeNull(AnnotationModel),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    getAreaPictureSuccess: (areaPicture: AreaPicture) => {
      self.areaPicture = areaPicture;
    },
  }))
  .actions(self => ({
    getAreaPictureFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getAreaPictureAnnotationsSuccess: (annotations: Annotation[]) => {
      if (annotations.length > 0) {
        self.annotation = annotations[1];
      }
    },
  }))
  .actions(self => ({
    getAreaPictureAnnotationsFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getAreaPicture: flow(function* (id: string) {
      const areaPictureApi = new AreaPictureApi(self.environment.api);
      try {
        const getAreaPictureResult = yield areaPictureApi.getAreaPicture(self.currentAccount.id, id);
        self.getAreaPictureSuccess(getAreaPictureResult);
      } catch (e) {
        self.getAreaPictureFail(e);
      }
    }),
  }))
  .actions(self => ({
    getAreaPictureAnnotations: flow(function* (id: string) {
      const areaPictureApi = new AreaPictureApi(self.environment.api);
      try {
        const getAreaPictureAnnotationsResult = yield areaPictureApi.getAreaPictureAnnotations(self.currentAccount.id, id);
        self.getAreaPictureAnnotationsSuccess(getAreaPictureAnnotationsResult);
      } catch (e) {
        self.getAreaPictureAnnotationsFail(e);
      }
    }),
  }));

export interface AreaPictureStore extends Instance<typeof AreaPictureStoreModel> {}

export interface AreaPictureStoreSnapshotOut extends SnapshotOut<typeof AreaPictureStoreModel> {}

export interface AreaPictureStoreSnapshotIn extends SnapshotIn<typeof AreaPictureStoreModel> {}
