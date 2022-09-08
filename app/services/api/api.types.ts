import { GeneralApiProblem } from './api-problem';
import { Transaction } from '../../models/transaction/transaction';
import { Account } from '../../models/account/account';
import { User } from '../../models/user/user';

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

export type GetOnboardingURL = { kind: 'ok'; redirectionUrl: string; successUrl: string; failureUrl: string } | GeneralApiProblem;

export type SignInResult = { kind: 'ok'; redirectionUrl: string; successUrl: string; failureUrl: string } | GeneralApiProblem;

export type GetTokenResult = { kind: 'ok'; accessToken: string; refreshToken: string; whoami: Whoami } | GeneralApiProblem;

export type GetWhoAmIResult = { kind: 'ok'; user: User } | GeneralApiProblem;

export type GetUserAccount = { kind: 'ok'; account: Account } | GeneralApiProblem;

export type InitPaymentResult = { kind: 'ok'; paymentInitiation: { id: string } & RedirectionUrlsStatus } | GeneralApiProblem;
