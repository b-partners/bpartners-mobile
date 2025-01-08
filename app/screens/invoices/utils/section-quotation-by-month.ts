import { Invoice } from '@bpartners/typescript-client';

import { TxKeyPath, translate } from '../../../i18n';
import { invoicesGroupedByMonth } from './invoicesGroupedByMonth';

export const sectionInvoicesByMonth = (invoices: Invoice[]) => {
  const quotationGroupedByMonth = invoicesGroupedByMonth(invoices);
  const sectionedQuotation = [];

  for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
    const currentInvoices = quotationGroupedByMonth[monthNumber];
    if (currentInvoices) {
      sectionedQuotation.push({
        title: translate(`months.${new Date(monthNumber).getMonth()}` as TxKeyPath),
        data: currentInvoices,
      });
    }
  }
  return sectionedQuotation;
};
