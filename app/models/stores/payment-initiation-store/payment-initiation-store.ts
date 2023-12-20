import { PaymentApi } from '../../../services/api/payment-api';
import { PaymentInitiation } from '../../entities/payment-initiation/payment-initiation';
import { withCredentials } from '../../extensions/with-credentials';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';
import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

export const PaymentInitiationStoreModel = types
  .model('Transaction')
  .props({
    initiatingPayment: types.maybeNull(types.boolean),
    paymentUrl: types.maybeNull(types.string),
    checkInit: types.maybeNull(types.boolean),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .extend(withCredentials)
  .actions(self => ({
    catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
  }))
  .actions(self => ({
    initSuccess: paymentUrl => {
      self.initiatingPayment = false;
      self.paymentUrl = paymentUrl;
    },
  }))
  .actions(self => ({
    initFail: error => {
      self.initiatingPayment = false;
      self.paymentUrl = '';
      self.checkInit = false;
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    init: flow(function* (payload: PaymentInitiation) {
      self.initiatingPayment = true;
      self.paymentUrl = null;
      const paymentInitiationApi = new PaymentApi(self.environment.api);
      try {
        const initPaymentResult = yield paymentInitiationApi.init(self.currentAccount.id, payload);
        __DEV__ && console.tron.log(`Payment ${initPaymentResult.paymentInitiation.id} initiated`);
        self.initSuccess(initPaymentResult.paymentInitiation.redirectionUrl);
      } catch (e) {
        self.initFail(e);
      }
    }),
  }));

export interface PaymentInitiationStore extends Instance<typeof PaymentInitiationStoreModel> {}

export interface TransactionStoreSnapshotOut extends SnapshotOut<typeof PaymentInitiationStoreModel> {}

export interface TransactionStoreSnapshotIn extends SnapshotIn<typeof PaymentInitiationStoreModel> {}

export const createTransactionStoreDefaultModel = () =>
  types.optional(PaymentInitiationStoreModel, {
    customers: [],
    products: [],
    paymentUrl: null,
    initiatingPayment: false,
  });
