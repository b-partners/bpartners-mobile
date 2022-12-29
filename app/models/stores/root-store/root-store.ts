import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { AccountHolder } from '../../entities/account-holder/account-holder';
import { Account } from '../../entities/account/account';
import { User } from '../../entities/user/user';
import { AuthStoreModel } from '../auth-store/auth-store';
import { FileStoreModel } from '../file-store/file-store';
import { InvoiceStoreModel } from '../invoice-store/invoice-store';
import { MarketplaceStoreModel } from '../marketplace-store/marketplace-store';
import { LegalFileStoreModel } from '../legal-file-store/legal-file-store';
import { OnboardingStoreModel } from '../onboarding-store/onboarding-store';
import { PaymentInitiationStoreModel } from '../payment-initiation-store/payment-initiation-store';
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
    legalFilesStore: types.optional(LegalFileStoreModel, {} as any)
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
