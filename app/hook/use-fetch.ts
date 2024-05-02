import { onSnapshot } from 'mobx-state-tree';
import { useEffect, useState } from 'react';

import { useStores } from '../models';
import { UseFetchOptions } from './type';

/**
 * A hook for fetching data
 *
 * Internally this hook replace will set the store to the response data of the
 * api call
 *
 * It encapsulate repetitive pattern when fetching data such as a state variable holding error, loading state, ...
 * */
function useFetch<T>(fetchAction: () => Promise<T | any>, options: UseFetchOptions, deps?: any[]) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>();
  const { store, mutateOnly } = options;

  const rootStore = useStores();
  const modelStore = store && rootStore[store];
  const [data, setData] = useState<typeof modelStore | T>(null);
  onSnapshot(rootStore, snapshot => __DEV__ && console.tron.log('store changed' + JSON.stringify(snapshot)));

  async function load() {
    setIsLoading(true);
    try {
      // The action should return de data as response in case if !store
      const response = await fetchAction();
      // use the data from the store as return value
      if (store) {
        setData(modelStore);
      } else {
        setData(response);
      }
    } catch (e) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!mutateOnly) {
      (async () => await load())();
    }
  }, [...deps]);

  async function mutate() {
    await load();
  }

  return { data, isLoading, error, refresh: mutate };
}

export default useFetch;
