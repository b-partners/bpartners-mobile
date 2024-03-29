import { InvoiceSnapshotIn, InvoiceSnapshotOut } from '../../../models/entities/invoice/invoice';
import { invoicesGroupedByMonth } from './invoicesGroupedByMonth';

export const sectionInvoicesByMonth = (invoices: InvoiceSnapshotIn) => {
  const quotationGroupedByMonth = invoicesGroupedByMonth(invoices);
  const sectionedQuotation = [];
  for (const quotationByMonthKey in quotationGroupedByMonth) {
    if (quotationGroupedByMonth.hasOwnProperty(quotationByMonthKey)) {
      const quotationByMonthElement: InvoiceSnapshotOut[] = quotationGroupedByMonth[quotationByMonthKey];
      sectionedQuotation.unshift({
        title: new Intl.DateTimeFormat('default', { month: 'long' }).format(new Date(quotationByMonthElement[0].sendingDate)),
        data: quotationByMonthElement,
      });
    }
  }
  return sectionedQuotation;
};
