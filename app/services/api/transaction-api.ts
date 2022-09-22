import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GetTransactionCategoriesResult, GetTransactionsResult } from './api.types';
import { getGeneralApiProblem } from './api-problem';
import { TransactionCategory } from '../../models/transaction-category/transaction-category';

export class TransactionApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getTransactions(accountId: string): Promise<GetTransactionsResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/transactions`);
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const transactions = response.data;
      return { kind: 'ok', transactions };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }

  async getTransactionCategories(accountId: string, unique = true, userDefined = undefined): Promise<GetTransactionCategoriesResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/transactionCategories`, {
        unique,
        userDefined,
      });
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const transactionCategories = response.data;
      return { kind: 'ok', transactionCategories };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }

  async updateTransactionCategories(
    accountId: string,
    transactionId: string,
    transactionCategory: TransactionCategory
  ): Promise<GetTransactionCategoriesResult> {
    const { type, vat } = transactionCategory;
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.post(`accounts/${accountId}/transactions/${transactionId}/transactionCategories`, [
        {
          type,
          vat,
        },
      ]);
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const transactionCategories = response.data;
      return { kind: 'ok', transactionCategories };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }
}
