import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { TransactionStoreModel } from '../transaction-store/transaction-store';
import { OnboardingStoreModel } from '../onboarding-store/onboarding-store';
import { AuthStoreModel } from '../auth-store/auth-store';
import { PaymentInitiationStoreModel } from '../payment-initiation-store/payment-initiation-store';
import { AccountHolder } from '../account-holder/account-holder';
import { Account } from '../account/account';
import { User } from '../user/user';

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model('RootStore').props({
    transactionStore: types.optional(TransactionStoreModel, {} as any),
    onboardingStore: types.optional(OnboardingStoreModel, {} as any),
    authStore: types.optional(AuthStoreModel, {} as any),
    paymentInitiationStore: types.optional(PaymentInitiationStoreModel, {} as any)
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
