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
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    upload: async (fileId: string, payload: File) => {
      try {
        const fileApi = new FileApi(self.environment.api);
        await fileApi.uploadFile(self.currentAccount.id, fileId, payload);
        showMessage(translate('common.registered'), { backgroundColor: palette.green });
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
