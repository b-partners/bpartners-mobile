import { types } from 'mobx-state-tree';
import { withEnvironment } from '../../extensions/with-environment';
import { AuthApi } from '../../../services/api/auth-api';
import { FileApi } from '../../../services/api/file-api';

export const FileStoreModel = types
  .model('File')
  .extend(withEnvironment)
  .actions(self => ({
    upload: async (payload: File, fileId: string) => {
      const authApi = new AuthApi(self.environment.api);
      const getWhoamiResult = await authApi.whoami();
      if (getWhoamiResult.kind !== 'ok') {
        console.tron.log(`[auth] bad data`);
        return;
      }

      const fileApi = new FileApi(self.environment.api);
      if (!payload) {
        __DEV__ && console.tron.log('No file to upload');
        return;
      }
      const fileUploadResult = await fileApi.uploadFile(fileId, payload);
      if (fileUploadResult.kind === 'ok') {
        __DEV__ && console.tron.log('successfully uploaded');
      } else {
        __DEV__ && console.tron.log(fileUploadResult);
      }
    },
  }))
  .actions(self => ({
    getFileInfos: async (fileId: string) => {
      const authApi = new AuthApi(self.environment.api);
      const getWhoamiResult = await authApi.whoami();
      if (getWhoamiResult.kind !== 'ok') {
        console.tron.log(`[auth] bad data`);
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
