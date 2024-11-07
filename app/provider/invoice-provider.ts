import { ArchiveStatus, InvoiceStatus } from '@bpartners/typescript-client';

import { GetListOptions } from '../queries';
import { storage } from '../utils/storage';
import { payingApi } from './api';

// const paymentApi = new PaymentApi(self.environment.api);
// const { invoices } = await paymentApi.getInvoices(self.currentAccount.id, options);
// return invoices || [];

export type InvoiceListParams = { status?: InvoiceStatus[]; archiveStatus?: ArchiveStatus; title?: string[] };

export const invoiceProvider = {
  async getList({ filters, page, pageSize }: GetListOptions<InvoiceListParams>) {
    const { archiveStatus, status, title } = filters || {};
    const api = await payingApi();
    const accountId = await storage.loadAccountId();
    try {
      const { data } = await api.getInvoices(accountId, page, pageSize, undefined, status, archiveStatus, undefined, title);
      return data || [];
    } catch (err) {
      console.trace(err);
    }
  },
};
