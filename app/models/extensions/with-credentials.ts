import { getRoot, IStateTreeNode } from 'mobx-state-tree';
import { RootStoreModel } from '../root-store/root-store';
import { User } from '../user/user';
import { AccountHolder } from '../account-holder/account-holder';
import { Account } from '../account/account';

export const withCredentials = (self: IStateTreeNode) => ({
  views: {
    get accessToken(): string {
      return getRoot<typeof RootStoreModel>(self).accessToken;
    },
    get refreshToken(): string {
      return getRoot<typeof RootStoreModel>(self).refreshToken;
    },
    get currentUser(): User {
      return getRoot<typeof RootStoreModel>(self).currentUser;
    },
    get currentAccount(): Account {
      return getRoot<typeof RootStoreModel>(self).currentAccount;
    },
    get currentAccountHolder(): AccountHolder {
      return getRoot<typeof RootStoreModel>(self).currentAccountHolder;
    },
  },
});
