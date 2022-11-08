import { ApiResponse } from 'apisauce';

import { TransactionCategory } from '../../models/entities/transaction-category/transaction-category';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { GetTransactionCategoriesResult, GetTransactionsResult } from './api.types';

export class TransactionApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getTransactions(accountId: string): Promise<GetTransactionsResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/transactions`);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const transactions = response.data.map(item => ({
      ...item,
      category: item.category && item.category.length ? item.category[0] : null,
    }));
    return { kind: 'ok', transactions };
  }

  async getTransactionCategories(
    accountId: string,
    unique = true,
    userDefined = undefined,
    from?: string,
    to?: string
  ): Promise<GetTransactionCategoriesResult> {
    // by default the date interval will be from the past 6 month to the current date
    const date = new Date();
    const DEFAULT_ENDING_DATE = new Date().toISOString().split('T')[0];
    const DEFAULT_STARTING_DATE = new Date(date.getFullYear(), date.getMonth() - 6, date.getDate()).toISOString().split('T')[0];

    to = to || DEFAULT_ENDING_DATE;
    from = from || DEFAULT_STARTING_DATE;

    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/transactionCategories`, {
        unique,
        userDefined,
        from,
        to,
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
      throw new Error('bad-data');
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
