import { Account } from '../../../models/entities/account/account';

export const getCurrentAccount = (accounts: Account[]): Account => {
  const currentAccount = accounts?.filter(account => account.active);
  return currentAccount.length === 0 ? accounts[0] : currentAccount[0];
};
