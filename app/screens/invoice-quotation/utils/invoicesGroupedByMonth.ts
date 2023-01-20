import * as _ from 'lodash/fp';

import { InvoiceSnapshotIn } from "../../../models/entities/invoice/invoice";

export const invoicesGroupedByMonth = (invoices: InvoiceSnapshotIn) => {
  return _.groupBy(value => value.sendingDate.getMonth(), invoices);
};
