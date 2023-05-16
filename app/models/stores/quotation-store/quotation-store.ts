import { Instance, SnapshotIn, SnapshotOut, detach, flow, types } from 'mobx-state-tree';

import { withEnvironment, withRootStore } from '../..';
import { translate } from '../../../i18n';
import { PaymentApi } from '../../../services/api/payment-api';
import { showMessage } from '../../../utils/snackbar';
import { Criteria } from '../../entities/criteria/criteria';
import { InvoiceModel } from '../../entities/invoice/invoice';
import { withCredentials } from '../../extensions/with-credentials';
import {InvoiceStoreSnapshotOut} from "../invoice-store/invoice-store";

export const QuotationStoreModel = types
    .model('QuotationStore')
    .props({
        quotations: types.optional(types.array(InvoiceModel), []),
        allQuotations: types.optional(types.array(InvoiceModel), []),
        loadingQuotation: types.optional(types.boolean, false),
    })
    .extend(withRootStore)
    .extend(withEnvironment)
    .extend(withCredentials)
    .actions(self => ({
        catchOrThrow: (error: Error) => self.rootStore.authStore.catchOrThrow(error),
    }))
    .actions(self => ({
        getAllQuotations: flow(function* (criteria: Criteria) {
            detach(self.allQuotations);
            const paymentApi = new PaymentApi(self.environment.api);
            try {
                const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
                __DEV__ && console.tron.log(getInvoicesResult);
                self.allQuotations.replace(getInvoicesResult.invoices as any);
            } catch (e) {
                __DEV__ && console.tron.log(e);
                showMessage(translate('errors.somethingWentWrong'));
                self.catchOrThrow(e);
            }
        }),
    }))
    .actions(self => ({
        getQuotationsSuccess: (quotations: InvoiceStoreSnapshotOut[]) => {
            self.quotations.replace(quotations as any);
        },
    }))
    .actions(() => ({
        getQuotationsFail: error => {
            __DEV__ && console.tron.log(error);
        },
    }))
    .actions(self => ({
        getQuotations: flow(function* (criteria: Criteria) {
            detach(self.quotations);
            self.loadingQuotation = true;
            const paymentApi = new PaymentApi(self.environment.api);
            try {
                const getInvoicesResult = yield paymentApi.getInvoices(self.currentAccount.id, criteria);
                self.getQuotationsSuccess(getInvoicesResult.invoices);
            } catch (e) {
                showMessage(translate('errors.somethingWentWrong'));
                self.catchOrThrow(e);
            } finally {
                self.loadingQuotation = false;
            }
        }),
    }));

export interface QuotationStore extends Instance<typeof QuotationStoreModel> {}

export interface QuotationStoreSnapshotOut extends SnapshotOut<typeof QuotationStoreModel> {}

export interface QuotationStoreSnapshotIn extends SnapshotIn<typeof QuotationStoreModel> {}