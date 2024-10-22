import { Instance, SnapshotIn, SnapshotOut, flow, types } from 'mobx-state-tree';

import env from '../../../config/env';
import { translate } from '../../../i18n';
import { AccountApi } from '../../../services/api/account-api';
import { AuthApi } from '../../../services/api/auth-api';
import { BankApi } from '../../../services/api/bank-api';
import { palette } from '../../../theme/palette';
import { RTLog } from '../../../utils/reactotron-log';
import { showMessage } from '../../../utils/snackbar';
import { clear, save, storage } from '../../../utils/storage';
import { AccountHolder, AccountHolderModel } from '../../entities/account-holder/account-holder';
import { Account, AccountInfos, AccountInfosModel, AccountModel } from '../../entities/account/account';
import { BusinessActivity } from '../../entities/business-activity/business-activity';
import { CompanyInfo } from '../../entities/company-info/company-info';
import { Feedback } from '../../entities/feedback/feedback';
import { GlobalInfo } from '../../entities/global-info/global-info';
import { AuthUserModel } from '../../entities/user/AuthUser';
import { User, UserModel } from '../../entities/user/user';
import { withEnvironment } from '../../extensions/with-environment';
import { withRootStore } from '../../extensions/with-root-store';

export const AuthStoreModel = types
  .model('SignIn')
  .props({
    redirectionUrl: types.maybeNull(types.string),
    successUrl: types.maybeNull(types.string),
    failureUrl: types.maybeNull(types.string),
    refreshToken: types.maybeNull(types.string),
    accessToken: types.maybeNull(types.string),
    currentUser: types.maybeNull(UserModel),
    currentAccount: types.maybeNull(AccountModel),
    accountList: types.optional(types.array(AccountModel), []),
    currentAccountHolder: types.maybeNull(AccountHolderModel),
    loadingUpdateInfos: types.optional(types.boolean, false),
    userAuth: types.maybeNull(AuthUserModel),
    accountInfo: types.maybeNull(AccountInfosModel),
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .actions(self => ({
    reset: () => {
      self.accessToken = undefined;
      self.currentAccountHolder = undefined;
      self.currentAccount = undefined;
      self.currentUser = undefined;
      self.successUrl = undefined;
      self.refreshToken = undefined;
      self.failureUrl = undefined;
      self.redirectionUrl = undefined;
    },
  }))
  .actions(self => ({
    catchOrThrow: (error: Error) => {
      const errorMessage = error.message;
      const errorMessageOption = { backgroundColor: palette.pastelRed };

      if (errorMessage === 'server') {
        return showMessage(translate('errors.somethingWentWrong'), errorMessageOption);
      } else if (errorMessage === 'cannot-connect' || errorMessage === 'timeout') {
        return showMessage(translate('errors.verifyConnection'), errorMessageOption);
      } else if (errorMessage === 'forbidden') {
        return self.reset();
      } else {
        return showMessage(translate('errors.somethingWentWrong'), errorMessageOption);
      }
    },
  }))
  .actions(() => ({
    signInFail: error => {
      __DEV__ && console.tron.log(error);
    },
  }))
  .actions(self => ({
    signInSuccess: urls => {
      self.successUrl = urls.successUrl && urls.successUrl.replace('+', '%2B');
      self.failureUrl = urls.failureUrl;
      self.redirectionUrl = urls.redirectionUrl;
    },
  }))
  .actions(self => ({
    signIn: flow(function* (phoneNumber: string) {
      const signInApi = new AuthApi(self.environment.api);
      try {
        const result = yield signInApi.signIn(phoneNumber);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { kind, ...urls } = result;
        self.signInSuccess(urls);
      } catch (e) {
        self.signInFail(e);
        self.catchOrThrow(e);
      }
    }),
  }))
  .actions(self => ({
    setCachedCredentials: flow(function* () {
      // yield AsyncStorage.multiSet([['accessToken', self.accessToken]]);
      yield save('accessToken', self.accessToken);
    }),
  }))
  .actions(self => ({
    setCurrentUser: (user: User) => {
      self.currentUser = user;
    },
  }))
  .actions(() => ({
    getTokenFail: error => {
      __DEV__ && console.tron.log(error.message);
      throw error;
    },
  }))
  .actions(self => ({
    logout: flow(function* () {
      self.accessToken = undefined;
      self.refreshToken = undefined;
      self.currentUser = undefined;
      self.currentAccount = undefined;
      self.currentAccountHolder = undefined;
      yield clear();
    }),
  }))
  .actions(self => ({
    getTokenSuccess: flow(function* ({ accessToken, refreshToken }) {
      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
      yield self.setCachedCredentials();
    }),
  }))
  .actions(self => ({
    getToken: flow(function* (code) {
      const signInApi = new AuthApi(self.environment.api);
      try {
        const { accessToken, refreshToken } = env.isCi
          ? {
              accessToken: env.ciAccessToken,
              refreshToken: null,
            }
          : yield signInApi.getToken(code);
        yield self.getTokenSuccess({ accessToken: accessToken, refreshToken: refreshToken });
      } catch (e) {
        self.getTokenFail(e);
      }
    }),
  }))
  .actions(self => ({
    registerFCMToken: flow(function* (token: string) {
      const authApi = new AuthApi(self.environment.api);
      try {
        const getEndpointARNResult = yield authApi.tokenRegistration(self.currentUser.id, token);
        self.setCurrentUser(getEndpointARNResult.user);
        return getEndpointARNResult;
      } catch (e) {
        self.catchOrThrow(e);
        RTLog(e.message);
      }
    }),
  }))
  .actions(self => ({
    whoami: flow(function* (accessToken: string) {
      __DEV__ && console.tron.log('WHO AM I ?');
      const signInApi = new AuthApi(self.environment.api);
      try {
        yield self.getTokenSuccess({ accessToken });
        const whoAmiResult = yield signInApi.whoami();
        self.currentUser = whoAmiResult.user;
      } catch (e) {
        self.catchOrThrow(e);
        __DEV__ && console.tron.log('Handle who am I error here');
      }
    }),
  }))
  .actions(self => ({
    getAccountSuccess: async (currentUser: User, currentAccount: Account, currentAccountHolder: AccountHolder) => {
      self.currentAccount = { ...currentAccount };
      self.currentAccountHolder = { ...currentAccountHolder };
      self.accountInfo = { ...currentAccount };

      await save('currentUser', currentUser);
      await save('currentAccount', currentAccount);
      await save('currentAccountHolder', currentAccountHolder);

      await storage.saveUserId(currentUser.id);
      await storage.saveAccountId(currentAccount.id);
      await storage.saveAccountHolderId(currentAccountHolder.id);
    },
  }))
  .actions(self => ({
    getAccountFail: error => {
      __DEV__ && console.tron.log(error.message);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    getAccounts: flow(function* () {
      const accountApi = new AccountApi(self.environment.api);
      try {
        const getAccountResult = yield accountApi.getAccount(self.currentUser.id);
        const getAccountHolderResult = yield accountApi.getAccountHolders(self.currentUser.id, getAccountResult.account.id);
        self.getAccountSuccess(self.currentUser, getAccountResult.account, getAccountHolderResult.accountHolder);
      } catch (e) {
        self.getAccountFail(e);
        __DEV__ && console.tron.log('Handle who am I error here');
      }
    }),
  }))
  .actions(self => ({
    getAccountListSuccess: (accountList: Account[]) => {
      const accountModels = accountList.map(account => AccountModel.create(account));
      self.accountList.replace(accountModels);
    },
  }))
  .actions(self => ({
    getAccountListFail: error => {
      __DEV__ && console.tron.log(error.message);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    // @ts-ignore
    getAccountList: flow(function* () {
      const accountApi = new AccountApi(self.environment.api);
      try {
        const getAccountListResult = yield accountApi.getAccounts(self.currentUser.id);
        self.getAccountListSuccess(getAccountListResult);
        return getAccountListResult;
      } catch (e) {
        self.getAccountFail(e);
        __DEV__ && console.tron.log('Handle who am I error here');
      }
    }),
  }))
  .actions(self => ({
    updateAccountInfosSuccess: (accountInfo: AccountInfos) => {
      self.accountInfo = accountInfo;
    },
  }))
  .actions(self => ({
    updateAccountInfosFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    // @ts-ignore
    updateAccountInfos: flow(function* (infos: AccountInfos) {
      const bankApi = new BankApi(self.environment.api);
      const successMessageOption = { backgroundColor: palette.green };
      try {
        const { name, iban, bic } = yield bankApi.updateAccountInfos(self.currentUser.id, self.currentAccount.id, infos);
        const accountInfoResult = { name, iban, bic };
        self.updateAccountInfosSuccess(accountInfoResult);
        showMessage(translate('common.registered'), successMessageOption);
        return accountInfoResult;
      } catch (e) {
        self.updateAccountInfosFail(e);
      } finally {
        self.loadingUpdateInfos = false;
      }
    }),
  }))
  .actions(self => ({
    disconnectBankSuccess: (accountInfo: AccountInfos) => {
      self.accountInfo = accountInfo;
    },
  }))
  .actions(self => ({
    disconnectBankFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    // @ts-ignore
    disconnectBank: flow(function* () {
      const bankApi = new BankApi(self.environment.api);
      const successMessageOption = { backgroundColor: palette.green };
      try {
        const { name, iban, bic } = yield bankApi.disconnectBank(self.currentUser.id);
        const accountInfoResult = { name, iban, bic };
        self.updateAccountInfosSuccess(accountInfoResult);
        showMessage(translate('bankScreen.disconnectionModal.disconnected'), successMessageOption);
        return accountInfoResult;
      } catch (e) {
        self.updateAccountInfosFail(e);
      } finally {
        self.loadingUpdateInfos = false;
      }
    }),
  }))
  .actions(() => ({
    setActiveAccountSuccess: () => {
      __DEV__ && console.tron.log('Account activated successfully !');
      // self.currentUser = updatedUser;
    },
  }))
  .actions(self => ({
    setActiveAccountFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    // @ts-ignore
    setActiveAccount: flow(function* (accountID: string) {
      const successMessageOption = { backgroundColor: palette.green };
      const accountApi = new AccountApi(self.environment.api);
      try {
        const updatedUser = yield accountApi.setActiveAccount(self.currentUser.id, accountID);
        self.setActiveAccountSuccess();
        showMessage(translate('common.addedOrUpdated'), successMessageOption);
        return updatedUser;
      } catch (e) {
        self.setActiveAccountFail(e);
      }
    }),
  }))
  .actions(self => ({
    updateAccountHolderInfosSuccess: (accountHolder: AccountHolder) => {
      self.currentAccountHolder = accountHolder;
    },
  }))
  .actions(self => ({
    updateAccountHolderInfosFail: error => {
      __DEV__ && console.tron.log(error);
      self.catchOrThrow(error);
    },
  }))
  .actions(self => ({
    updateGlobalInfos: flow(function* (globalInfos: GlobalInfo) {
      const accountApi = new AccountApi(self.environment.api);
      const successMessageOption = { backgroundColor: palette.green };
      try {
        const updateAccountHolderResult = yield accountApi.updateGlobalInfo(
          self.currentUser.id,
          self.currentAccount.id,
          self.currentAccountHolder.id,
          globalInfos
        );
        self.updateAccountHolderInfosSuccess(updateAccountHolderResult.accountHolder);
        showMessage(translate('common.registered'), successMessageOption);
      } catch (e) {
        self.updateAccountHolderInfosFail(e);
      }
    }),
  }))
  .actions(self => ({
    updateFeedback: flow(function* (feedback: Feedback) {
      const accountApi = new AccountApi(self.environment.api);
      const successMessageOption = { backgroundColor: palette.green };
      try {
        const updateAccountHolderResult = yield accountApi.updateFeedbackLink(self.currentUser.id, self.currentAccountHolder.id, feedback);
        self.updateAccountHolderInfosSuccess(updateAccountHolderResult.accountHolder);
        showMessage(translate('common.registered'), successMessageOption);
      } catch (e) {
        self.updateAccountHolderInfosFail(e);
      }
    }),
  }))
  .actions(self => ({
    updateCompanyInfos: flow(function* (companyInfos: CompanyInfo) {
      const accountApi = new AccountApi(self.environment.api);
      const successMessageOption = { backgroundColor: palette.green };
      try {
        const updateAccountHolderResult = yield accountApi.updateCompanyInfo(
          self.currentUser.id,
          self.currentAccount.id,
          self.currentAccountHolder.id,
          companyInfos
        );
        self.updateAccountHolderInfosSuccess(updateAccountHolderResult.accountHolder);
        showMessage(translate('common.registered'), successMessageOption);
      } catch (e) {
        self.updateAccountHolderInfosFail(e);
      }
    }),
  }))
  .actions(self => ({
    updateRevenueTargets: flow(function* (revenueTargets) {
      const accountApi = new AccountApi(self.environment.api);
      const successMessageOption = { backgroundColor: palette.green };
      try {
        const updateAccountHolderResult = yield accountApi.updateRevenueTargets(
          self.currentUser.id,
          self.currentAccount.id,
          self.currentAccountHolder.id,
          revenueTargets
        );
        self.updateAccountHolderInfosSuccess(updateAccountHolderResult.accountHolder);
        showMessage(translate('common.registered'), successMessageOption);
      } catch (e) {
        self.updateAccountHolderInfosFail(e);
      }
    }),
  }))
  .actions(self => ({
    updateBusinessActivities: flow(function* (activity: BusinessActivity) {
      const accountApi = new AccountApi(self.environment.api);
      const successMessageOption = { backgroundColor: palette.green };
      try {
        const updateAccountHolderResult = yield accountApi.updateBusinessActivities(
          self.currentUser.id,
          self.currentAccount.id,
          self.currentAccountHolder.id,
          activity
        );
        self.updateAccountHolderInfosSuccess(updateAccountHolderResult.accountHolder);
        showMessage(translate('common.registered'), successMessageOption);
      } catch (e) {
        self.updateAccountHolderInfosFail(e);
      }
    }),
  }))
  .actions(self => ({
    setUserAuthUserName: (userName: string) => {
      self.userAuth.userName = userName;
    },
  }));

export interface AuthStore extends Instance<typeof AuthStoreModel> {}

export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> {}

export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> {}

export const createAuthStoreDefaultModel = () =>
  types.optional(AuthStoreModel, {
    accessToken: null,
    currentAccountHolder: null,
    currentAccount: null,
    currentUser: null,
    successUrl: null,
    refreshToken: null,
    failureUrl: null,
    redirectionUrl: null,
  });
