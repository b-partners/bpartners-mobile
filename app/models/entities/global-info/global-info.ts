import { ContactAddressModel } from '../contact-address/contact-address';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const GlobalInfoModel = types.model('GlobalInfo').props({
  name: types.maybeNull(types.string),
  siren: types.maybeNull(types.string),
  officialActivityName: types.maybeNull(types.string),
  initialCashFlow: types.maybeNull(types.number),
  contactAddress: types.maybeNull(ContactAddressModel),
});

export interface GlobalInfo extends Instance<typeof GlobalInfoModel> {}

export interface GlobalInfoSnapshotOut extends SnapshotOut<typeof GlobalInfoModel> {}

export interface GlobalInfoSnapshotIn extends SnapshotIn<typeof GlobalInfoModel> {}
