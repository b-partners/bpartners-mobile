import { PAGE_SIZE, ProspectListParam, prospectProvider } from '../provider';
import { TUseQueryListFetcher, useQueryList } from './use-query-list';

export const useQueryProspect = (defaultParams: ProspectListParam) => {
  const fetcher: TUseQueryListFetcher<any> = async (page = 1, filters = {}) => {
    return await prospectProvider.getList({ filters: { ...filters, ...defaultParams }, page, pageSize: PAGE_SIZE });
  };
  return useQueryList(fetcher, ['query', 'prospect', 'list', defaultParams.status], {
    page: 1,
    filters: {},
  });
};
