import { Whoami } from '@bpartners/typescript-client';

import { createPersistedStore } from './utils';

export const ZAUTH_STORE_STORAGE_NAME = 'z-auth-store';
export type ZAuthStoretype = {
  whoami: Whoami | null;
  setWhoami: (whoami: Whoami | null) => void;
};

export const useZAuthStore = createPersistedStore<ZAuthStoretype>({
  name: ZAUTH_STORE_STORAGE_NAME,
  state: set => ({
    whoami: null,
    setWhoami: whoami => set({ whoami }),
  }),
});
