import { Account, AccountInfos } from '../../../models/entities/account/account';

export const getCurrentAccount = (accounts: Account[]): Account => {
  const currentAccount = accounts?.filter(account => account.active);
  return currentAccount.length === 0 ? accounts[0] : currentAccount[0];
};

export const getCurrentAccountInfo = (accountList: Account[]): AccountInfos => {
  const { name, bic, iban } = getCurrentAccount(accountList);
  return { name, bic, iban };
};
