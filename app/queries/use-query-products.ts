import { PAGE_SIZE, productProvider } from '../provider';
import { TUseQueryListFetcher, useQueryList } from './use-query-list';

export const useQueryProducts = () => {
  const fetcher: TUseQueryListFetcher<any> = async (page = 1, filters = {}) => {
    return await productProvider.getList({ filters, page, pageSize: PAGE_SIZE });
  };

  return useQueryList(fetcher, ['query', 'invoice', 'list'], {
    page: 1,
    filters: { descriptionFilter: '' },
  });
};
