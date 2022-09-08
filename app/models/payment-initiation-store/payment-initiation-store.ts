import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { PaymentInitiation } from '../payment-initiation/payment-initiation';
import { withEnvironment } from '../extensions/with-environment';
import { AuthApi } from '../../services/api/auth-api';
import { AccountApi } from '../../services/api/account-api';
import { PaymentInitiationApi } from '../../services/api/payment-initiation-api';

export const PaymentInitiationStoreModel = types
  .model('Transaction')
  .props({
    initiatingPayment: types.maybeNull(types.boolean),
    paymentUrl: types.maybeNull(types.string),
  })
  .extend(withEnvironment)
  .actions(self => ({
    initSuccess: paymentUrl => {
      self.initiatingPayment = false;
      self.paymentUrl = paymentUrl;
    },
  }))
  .actions(self => ({
    init: async (payload: PaymentInitiation) => {
      self.initiatingPayment = true;
      self.paymentUrl = null;
      const authApi = new AuthApi(self.environment.api);
      const getWhoamiResult = await authApi.whoami();
      if (getWhoamiResult.kind !== 'ok') {
        console.tron.log(`[auth] bad data`);
        return;
      }
      const accountApi = new AccountApi(self.environment.api);
      const getAccountResult = await accountApi.getAccounts(getWhoamiResult.user.id);
      if (getAccountResult.kind !== 'ok') {
        console.tron.log(`[account] bad data`);
        return;
      }
      const paymentInitiationApi = new PaymentInitiationApi(self.environment.api);
      const initPaymentResult = await paymentInitiationApi.init(getAccountResult.account.id, payload);
      if (initPaymentResult.kind === 'ok') {
        console.tron.log(`Payment ${initPaymentResult.paymentInitiation.id} initiated`);
        self.initSuccess(initPaymentResult.paymentInitiation.redirectionUrl);
      } else {
        __DEV__ && console.tron.log(initPaymentResult.kind);
        self.initiatingPayment = false;
      }
    },
  }));

export interface PaymentInitiationStore extends Instance<typeof PaymentInitiationStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof PaymentInitiationStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof PaymentInitiationStoreModel> {}

export const createTransactionStoreDefaultModel = () => types.optional(PaymentInitiationStoreModel, {});
