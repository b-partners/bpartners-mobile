import { Invoice, InvoiceSnapshotOut } from '../../../models/entities/invoice/invoice';
import { invoicesGroupedByMonth } from './invoicesGroupedByMonth';

export const sectionInvoicesByMonth = (invoices: Invoice) => {
  const quotationGroupedByMonth = invoicesGroupedByMonth(invoices);
  const sectionedQuotation = [];
  for (const quotationByMonthKey in quotationGroupedByMonth) {
    if (quotationGroupedByMonth.hasOwnProperty(quotationByMonthKey)) {
      const quotationByMonthElement: InvoiceSnapshotOut[] = quotationGroupedByMonth[quotationByMonthKey];
      sectionedQuotation.push({
        title: new Intl.DateTimeFormat('default', { month: 'long' }).format(new Date(quotationByMonthElement[0].sendingDate)),
        data: quotationByMonthElement,
      });
    }
  }
  return sectionedQuotation;
};
