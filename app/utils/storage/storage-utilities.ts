import { loadString, saveString } from './storage';

const TOKEN_ITEM = 'access-token';
const USER_ID_ITEM = 'user-id';
const ACCOUNT_ID_ITEM = 'account-id';
const ACCOUNT_HOLDER_ID_ITEM = 'account-holder-id';

export const storage = {
  saveAccessToken: async (accessToken: string) => {
    await saveString(TOKEN_ITEM, accessToken);
  },
  loadAccessToken: async () => {
    return await loadString(TOKEN_ITEM);
  },
  saveUserId: async (whoamiId: string) => {
    await saveString(USER_ID_ITEM, whoamiId);
  },
  loadUserId: async () => {
    return await loadString(USER_ID_ITEM);
  },
  saveAccountId: async (accountId: string) => {
    await saveString(ACCOUNT_ID_ITEM, accountId);
  },
  loadAccountId: async () => {
    return await loadString(ACCOUNT_ID_ITEM);
  },
  saveAccountHolderId: async (accountHolderId: string) => {
    await saveString(ACCOUNT_HOLDER_ID_ITEM, accountHolderId);
  },
  loadAccountHolderId: async () => {
    return await loadString(ACCOUNT_HOLDER_ID_ITEM);
  },
};
