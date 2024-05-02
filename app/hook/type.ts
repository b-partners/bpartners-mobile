import { TRootStoreModelKey } from '../models';

export interface UseFetchOptions {
  store?: TRootStoreModelKey;
  mutateOnly?: boolean;
}
