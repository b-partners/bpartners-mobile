import { translate } from 'i18n-js';
import { onSnapshot } from 'mobx-state-tree';
import { useEffect, useState } from 'react';

import { useStores } from '../models';
import { palette } from '../theme/palette';
import { showMessage } from '../utils/snackbar';
import { UseFetchOptions } from './type';

/**
 * A hook for fetching data
 *
 * Internally this hook replace will set the store to the response data of the
 * api call
 *
 * It encapsulate repetitive pattern when fetching data such as a state variable holding error, loading state, ...
 * */
function useFetch<T, P>(fetchAction: (params?: P) => Promise<T | any>, options: UseFetchOptions, deps = []) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>();
  const { store, mutateOnly = false, txErrorMessage } = options;

  const rootStore = useStores();
  const modelStore = store && rootStore[store];
  const [data, setData] = useState<typeof modelStore | T>(null);
  onSnapshot(rootStore, snapshot => __DEV__ && console.tron.log('store changed' + JSON.stringify(snapshot)));
  const errorMessageStyles = { backgroundColor: palette.pastelRed };

  async function fetch(params?: P) {
    setIsLoading(true);
    try {
      // The action should return de data as response in case if !store
      const response = await fetchAction(params);
      // use the data from the store as return value
      if (store) {
        setData(modelStore);
      } else {
        setData(response);
      }
    } catch {
      txErrorMessage && showMessage(translate(txErrorMessage), errorMessageStyles);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!mutateOnly) {
      (async () => await fetch())();
    }
  }, [...deps]);

  return { data, isLoading, error, fetch };
}

export default useFetch;
