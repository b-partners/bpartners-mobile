import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import { translate } from '../../../i18n';
import { AreaPictureApi } from '../../../services/api/area-picture-api';
import { FileApi } from '../../../services/api/file-api';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { Annotation, AnnotationModel } from '../../entities/annotation/annotation';
import { AreaPicture, AreaPictureModel } from '../../entities/area-picture/area-picture';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const AreaPictureStoreModel = types
  .model('Bank')
  .props({
    areaPicture: types.maybeNull(AreaPictureModel),
    annotations: types.optional(types.array(AnnotationModel), []),
    pictureUrl: types.maybeNull(types.string),
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
      self.annotations.replace(annotations);
    },
  }))
  .actions(self => ({
    getAreaPictureAnnotationsFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    setCurrentPictureUrl: (pictureUrl: string) => {
      self.pictureUrl = pictureUrl;
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
        self.getAreaPictureAnnotationsSuccess(getAreaPictureAnnotationsResult[0].annotations);
      } catch (e) {
        self.getAreaPictureAnnotationsFail(e);
      }
    }),
  }))
  .actions(self => ({
    getPictureUrl: async (fileId: string) => {
      const fileApi = new FileApi(self.environment.api);
      try {
        const getPictureUrlResult = await fileApi.getFileURL(fileId, self.currentAccount.id, self.accessToken, 'AREA_PICTURE');
        // @ts-ignore
        self.setCurrentPictureUrl(getPictureUrlResult.fileURL);
      } catch (e) {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
        self.catchOrThrow(e);
      }
    },
  }));

export interface AreaPictureStore extends Instance<typeof AreaPictureStoreModel> {}

export interface AreaPictureStoreSnapshotOut extends SnapshotOut<typeof AreaPictureStoreModel> {}

export interface AreaPictureStoreSnapshotIn extends SnapshotIn<typeof AreaPictureStoreModel> {}