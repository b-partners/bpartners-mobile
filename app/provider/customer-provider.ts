import { CustomerStatus } from '@bpartners/typescript-client';

import { GetListOptions } from '../queries';
import { storage } from '../utils/storage';
import { customerApi } from './api';

export type CustomerListParams = { searchQuery: string };

export const customerProvider = {
  async getList({ filters, page, pageSize }: GetListOptions<CustomerListParams>) {
    const { searchQuery = '' } = filters || {};
    const searchValues = searchQuery.split(' ');
    const api = await customerApi();
    const accountId = await storage.loadAccountId();
    const { data } = await api.getCustomers(
      accountId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      CustomerStatus.ENABLED,
      searchValues,
      undefined,
      page,
      pageSize
    );
    return data || [];
  },
};
