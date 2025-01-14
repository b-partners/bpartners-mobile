import { PAGE_SIZE, customerProvider } from '../provider';
import { TUseQueryListFetcher, useQueryList } from './use-query-list';

export const useQueryCustomers = () => {
  const fetcher: TUseQueryListFetcher<any> = async (page = 1) => {
    return await customerProvider.getList({ filters: { searchQuery: '' }, page, pageSize: PAGE_SIZE });
  };

  return useQueryList(fetcher, ['query', 'invoice', 'list'], {
    page: 1,
    filters: { searchQuery: '' },
  });
};
