import { GeneralApiProblem } from './api-problem';
import { Transaction } from '../../models/entities/transaction/transaction';
import { Account } from '../../models/entities/account/account';
import { User } from '../../models/entities/user/user';
import { AccountHolder } from '../../models/entities/account-holder/account-holder';
import { TransactionCategory } from '../../models/entities/transaction-category/transaction-category';
import { Customer } from '../../models/entities/customer/customer';
import { Product } from '../../models/entities/product/product';
import { File } from '../../models/entities/file/File';

export interface Whoami {
  user: any;
}

export type RedirectionUrlsStatus = {
  redirectionUrl: string;
  redirectionStatusUrls: {
    successUrl: string;
    failureUrl: string;
  };
};

export type GetUsersResult = { kind: 'ok'; users: User[] } | GeneralApiProblem;
export type GetUserResult = { kind: 'ok'; user: User } | GeneralApiProblem;

export type GetTransactionsResult = { kind: 'ok'; transactions: Transaction[] } | GeneralApiProblem;

export type GetTransactionCategoriesResult = { kind: 'ok'; transactionCategories: TransactionCategory[] } | GeneralApiProblem;

export type UpdateTransactionCategoriesResult = { kind: 'ok'; transactionCategories: TransactionCategory[] } | GeneralApiProblem;

export type GetOnboardingURL = { kind: 'ok'; redirectionUrl: string; successUrl: string; failureUrl: string } | GeneralApiProblem;

export type SignInResult = { kind: 'ok'; redirectionUrl: string; successUrl: string; failureUrl: string } | GeneralApiProblem;

export type GetTokenResult = { kind: 'ok'; accessToken: string; refreshToken: string; whoami: Whoami } | GeneralApiProblem;

export type GetWhoAmIResult = { kind: 'ok'; user: User } | GeneralApiProblem;

export type GetUserAccount = { kind: 'ok'; account: Account } | GeneralApiProblem;

export type GetCustomersResult = { kind: 'ok'; customers: Customer[] } | GeneralApiProblem;

export type GetProductsResult = { kind: 'ok'; products: Product[] } | GeneralApiProblem;

export type GetAccountHolderResult = { kind: 'ok'; accountHolder: AccountHolder } | GeneralApiProblem;

export type InitPaymentResult = { kind: 'ok'; paymentInitiation: { id: string } & RedirectionUrlsStatus } | GeneralApiProblem;

export type GetFileInformation = { kind: 'ok'; fileInfos: File } | GeneralApiProblem;

export type UploadFileResult = { kind: 'ok'; message: string } | GeneralApiProblem;
