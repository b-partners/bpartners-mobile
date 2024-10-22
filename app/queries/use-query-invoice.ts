import { useQueryClient } from '@tanstack/react-query';

import { InvoiceStatus } from '../models/entities/invoice/invoice';
import { InvoiceListParams, invoiceProvider } from '../provider/invoice-provider';
import { TUseQueryListFetcher, useQueryList } from './use-query-list';

const PAGE_SIZE = 10;

export const useQueryInvoice = (defaultParams: InvoiceListParams = {}) => {
  const fetcher: TUseQueryListFetcher<any> = async (page = 1, filters = {}) => {
    return await invoiceProvider.getList({ filters: { ...filters, ...defaultParams }, page, pageSize: PAGE_SIZE });
  };

  const query = useQueryList(fetcher, ['query', 'invoice', 'list', defaultParams.status], {
    page: 1,
    filters: { status: InvoiceStatus.DRAFT, archiveStatus: 'ENABLED' },
  });
  const queryClient = useQueryClient();

  const invalidateInvoiceListCache = () => {
    queryClient.invalidateQueries({ queryKey: ['query', 'invoice', 'list'] });
  };

  return { ...query, invalidateInvoices: invalidateInvoiceListCache };
};
