import { Invoice } from '@bpartners/typescript-client';
import { groupBy } from 'lodash';

export const invoicesGroupedByMonth = (invoices: Invoice[]) => {
  return groupBy(invoices, value => new Date(value.sendingDate).getMonth());
};
