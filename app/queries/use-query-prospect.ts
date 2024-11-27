import { ProspectStatus } from '@bpartners/typescript-client';
import debounceFn from 'debounce-fn';
import { useEffect, useMemo, useState } from 'react';

import { PAGE_SIZE, ProspectListParam, prospectProvider } from '../provider';
import { TUseQueryListFetcher, useQueryList } from './use-query-list';

export const useQueryProspect = (defaultParams: ProspectListParam) => {
  const [{ name, status }, setFilters] = useState<ProspectListParam>({ name: '', status: ProspectStatus.TO_CONTACT });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFilters(defaultParams);
  }, []);

  const search = useMemo(() => debounceFn(setSearchQuery, { wait: 1000 }), []);

  useEffect(() => {
    search(name);
  }, [name]);

  const fetcher: TUseQueryListFetcher<any> = async (page = 1, filters = {}) => {
    return await prospectProvider.getList({ filters: { ...filters, ...defaultParams, name: searchQuery, status }, page, pageSize: PAGE_SIZE });
  };

  const setStatus = (newStatus: ProspectStatus) => {
    setFilters(prev => ({ ...prev, status: newStatus }));
  };

  const setSearchQueryName = (newName: string) => {
    setFilters(prev => ({ ...prev, name: newName }));
  };

  return {
    ...useQueryList(fetcher, ['query', 'prospect', 'list', status, searchQuery], {
      page: 1,
      filters: {},
    }),
    status,
    searchQuery: name,
    setStatus,
    setSearchQuery: setSearchQueryName,
  };
};
