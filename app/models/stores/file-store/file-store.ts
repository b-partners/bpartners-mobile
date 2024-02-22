import { types } from 'mobx-state-tree';

import { translate } from '../../../i18n';
import { AuthApi } from '../../../services/api/auth-api';
import { FileApi } from '../../../services/api/file-api';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const FileStoreModel = types
  .model('File')
  .props({
    fileUrl: types.maybeNull(types.string),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    setCurrentFileUrl: (fileUrl: string) => {
      self.fileUrl = fileUrl;
    },
  }))
  .actions(self => ({
    upload: async (fileId: string, fileType: string, type: string, payload: FormData) => {
      try {
        const fileApi = new FileApi(self.environment.api);
        await fileApi.uploadFile(self.currentAccount.id, fileId, fileType, type, payload);
      } catch (e) {
        self.catchOrThrow(e);
      }
    },
  }))
  .actions(self => ({
    getFileUrl: async (logoFileId: string) => {
      try {
        const fileApi = new FileApi(self.environment.api);
        const getFileUrlResult = await fileApi.getFileURL(logoFileId, self.currentAccount.id, self.accessToken, 'LOGO');
        // @ts-ignore
        self.setCurrentFileUrl(getFileUrlResult.fileURL);
      } catch (e) {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
        self.catchOrThrow(e);
      }
    },
  }))
  .actions(self => ({
    getFileInfos: async (fileId: string) => {
      const authApi = new AuthApi(self.environment.api);
      const getWhoamiResult = await authApi.whoami();
      if (getWhoamiResult.kind !== 'ok') {
        __DEV__ && console.tron.log(`[auth] bad data`);
        return getWhoamiResult.kind;
      }

      const fileApi = new FileApi(self.environment.api);
      const fileApiResult = await fileApi.getFileInfo(fileId);
      if (fileApiResult.kind === 'ok') {
        return fileApiResult.fileInfos;
      } else {
        __DEV__ && console.tron.log();
        return fileApiResult.kind;
      }
    },
  }));
