import { TxKeyPath } from '../i18n';
import { TRootStoreModelKey } from '../models';

export interface UseFetchOptions {
  store?: TRootStoreModelKey;
  mutateOnly?: boolean;
  txErrorMessage?: TxKeyPath;
}
