import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { AccountHolder } from '../../entities/account-holder/account-holder';
import { Account } from '../../entities/account/account';
import { User } from '../../entities/user/user';
import { AuthStoreModel } from '../auth-store/auth-store';
import { BankStoreModel } from '../bank-store/bank-store';
import { BusinessActivityStoreModel } from '../business-activity-store/business-activity-store';
import { CustomerStoreModel } from '../customer-store/customer-store';
import { DraftStoreModel } from '../draft-store/draft-store';
import { FileStoreModel } from '../file-store/file-store';
import { InvoiceStoreModel } from '../invoice-store/invoice-store';
import { LegalFileStoreModel } from '../legal-file-store/legal-file-store';
import { MarketplaceStoreModel } from '../marketplace-store/marketplace-store';
import { OnboardingStoreModel } from '../onboarding-store/onboarding-store';
import { PaymentInitiationStoreModel } from '../payment-initiation-store/payment-initiation-store';
import { ProductStoreModel } from '../product-store/product-store';
import { ProspectStoreModel } from '../prospect-store/prospect-store';
import { QuotationStoreModel } from '../quotation-store/quotation-store';
import { TransactionStoreModel } from '../transaction-store/transaction-store';

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model('RootStore').props({
    transactionStore: types.optional(TransactionStoreModel, {} as any),
    onboardingStore: types.optional(OnboardingStoreModel, {} as any),
    authStore: types.optional(AuthStoreModel, {} as any),
    paymentInitiationStore: types.optional(PaymentInitiationStoreModel, {} as any),
    fileStore: types.optional(FileStoreModel, {} as any),
    invoiceStore: types.optional(InvoiceStoreModel, {} as any),
    marketplaceStore: types.optional(MarketplaceStoreModel, {} as any),
    legalFilesStore: types.optional(LegalFileStoreModel, {} as any),
    customerStore: types.optional(CustomerStoreModel, {} as any),
    prospectStore: types.optional(ProspectStoreModel, {} as any),
    productStore: types.optional(ProductStoreModel, {} as any),
    draftStore: types.optional(DraftStoreModel, {} as any),
    quotationStore: types.optional(QuotationStoreModel, {} as any),
    bankStore: types.optional(BankStoreModel, {} as any),
    businessActivityStore: types.optional(BusinessActivityStoreModel, {} as any),
}).views(self => ({
    get accessToken(): string {
        return self?.authStore?.accessToken;
    },
    get refreshToken(): string {
        return self?.authStore?.refreshToken;
    },
    get currentUser(): User {
        return self?.authStore?.currentUser;
    },
    get currentAccount(): Account {
        return self?.authStore?.currentAccount;
    },
    get currentAccountHolder(): AccountHolder {
        return self?.authStore?.currentAccountHolder;
    }
}));

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>;

/**
 * The data of a RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>;

export type TRootStoreModelKey = keyof typeof RootStoreModel.properties;
