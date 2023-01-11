import * as _ from 'lodash/fp';

import { Invoice } from '../../../models/entities/invoice/invoice';

export const invoicesGroupedByMonth = (invoices: Invoice) => {
  return _.groupBy(value => value.sendingDate.getMonth(), invoices);
};
