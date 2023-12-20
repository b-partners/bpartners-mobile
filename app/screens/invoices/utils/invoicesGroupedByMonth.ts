import { InvoiceSnapshotIn } from '../../../models/entities/invoice/invoice';
import * as _ from 'lodash/fp';

export const invoicesGroupedByMonth = (invoices: InvoiceSnapshotIn) => {
  return _.groupBy(value => value.sendingDate.getMonth(), invoices);
};
