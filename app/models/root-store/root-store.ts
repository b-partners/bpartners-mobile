import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { TransactionStoreModel } from '../transaction-store/transaction-store';
import { OnboardingStoreModel } from '../onboarding-store/onboarding-store';
import { SignInStoreModel } from '../sign-in-store/sign-in-store';

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model('RootStore').props({
    transactionStore: types.optional(TransactionStoreModel, {} as any),
    onboardingStore: types.optional(OnboardingStoreModel, {} as any),
    signInStore: types.optional(SignInStoreModel, {} as any)
});

/**
 * The RootStore instance.
 */
export type RootStore = Instance<typeof RootStoreModel>;

/**
 * The data of a RootStore.
 */
export type RootStoreSnapshot = SnapshotOut<typeof RootStoreModel>;
