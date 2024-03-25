import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { TransactionStatus } from '../transaction/transaction';

export const TransactionExportInputModel = types.model('TransactionExportInput').props({
  from: types.maybeNull(types.Date),
  to: types.maybeNull(types.number),
  // @ts-ignore
  transactionStatus: types.maybeNull(TransactionStatus),
});

export interface TransactionExportInput extends Instance<typeof TransactionExportInputModel> {}

export interface TransactionExportInputSnapshotOut extends SnapshotOut<typeof TransactionExportInputModel> {}

export interface TransactionExportInputSnapshotIn extends SnapshotIn<typeof TransactionExportInputModel> {}
