import { QueryKey, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useStores } from '../models';

export type TUseQueryListFetcher<T> = (page: number, filters: Record<any, any>) => Promise<T[]>;

export interface GetListOptions<T extends Record<any, any> = any> {
  page?: number;
  pageSize?: number;
  filters?: T;
}

interface IQueryResult<T> {
  hasNext: boolean;
  data: T[];
}

interface QueryListState {
  page: number;
  filters: Record<any, any>;
}

const defaultQueryListState: QueryListState = { page: 1, filters: {} };

export const useQueryList = <T>(fetcher: TUseQueryListFetcher<T>, queryKey: QueryKey, defaultOptions?: QueryListState) => {
  const [options, setOptions] = useState(defaultOptions || defaultQueryListState);
  const { authStore } = useStores();

  const customFetcher = async () => {
    const currentResult = (await fetcher(options.page, options.filters)) || [];
    const nextResult = (await fetcher(options.page + 1, options.filters)) || [];

    return {
      data: currentResult,
      hasNext: nextResult.length !== 0,
    };
  };

  const { error, ...query } = useQuery<IQueryResult<T>>({ queryFn: customFetcher, queryKey: [...queryKey, options] });
  const setPage = (page: number) => setOptions(prev => ({ ...prev, page }));
  const setFilters = (filters: Record<any, any>) => setOptions(prev => ({ ...prev, filters: { ...prev.filters, ...filters } }));

  useEffect(() => {
    if (error?.message?.includes('Request failed with status code 403')) {
      authStore.logout();
    }
  }, [error]);

  return {
    query,
    data: query?.data?.data || [],
    hasNext: query?.data?.hasNext,
    isLoading: query.isFetching || query.isLoading,
    setPage,
    setFilters,
    ...options,
  };
};
