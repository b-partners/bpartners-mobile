import { AccountHolder, Point } from '@bpartners/typescript-client';

import { load, loadString, save, saveString } from './storage';

const TOKEN_ITEM = 'access-token';
const USER_ID_ITEM = 'user-id';
const ACCOUNT_ID_ITEM = 'account-id';
const ACCOUNT_HOLDER_ID_ITEM = 'account-holder-id';
const ACCOUNT_HOLDER_ITEM = 'account-holder';
const INITIAL_MARKER_ITEM = 'initial-marker';
const INITIAL_IMAGE_SIZE_ITEM = 'initial-image-size';

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
    const { id } = await load(ACCOUNT_HOLDER_ITEM);
    return id;
  },
  saveAccountHolder: async (accountHolder: AccountHolder) => {
    return await save(ACCOUNT_HOLDER_ITEM, accountHolder);
  },
  loadAccountHolder: async (): Promise<AccountHolder> => {
    return await load(ACCOUNT_HOLDER_ITEM);
  },
  saveInitialMarker: async (marker: Point) => {
    return await save(INITIAL_MARKER_ITEM, marker);
  },
  loadInitialMarker: async (): Promise<Point> => {
    return await load(INITIAL_MARKER_ITEM);
  },
  saveInitialImageSize: async (imageSize: number) => {
    return await save(INITIAL_IMAGE_SIZE_ITEM, imageSize);
  },
  loadInitialImageSize: async (): Promise<number> => {
    return await load(INITIAL_IMAGE_SIZE_ITEM);
  },
};
