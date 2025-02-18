import { storage } from '../utils/storage';
import { securityApi } from './api';

export const authProvider = {
  async getWhoami() {
    const api = await securityApi();
    const { data: whoami } = await api.whoami();
    await storage.saveUserId(whoami?.user?.id);
    return whoami;
  },
};
