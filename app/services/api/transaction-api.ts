import { ApiResponse } from 'apisauce';

import { TransactionFilter } from '../../models/entities/filter/filter';
import { TransactionCategory } from '../../models/entities/transaction-category/transaction-category';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import {
  AssociateTransactionResult,
  GetTransactionCategoriesResult,
  GetTransactionsResult,
  GetTransactionsSummaryResult,
  UpdateTransactionCategoriesResult,
} from './api.types';

export class TransactionApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getTransactions(accountId: string, filter: TransactionFilter): Promise<GetTransactionsResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/transactions`, filter);
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

  async getTransactionsSummary(accountId: string, year: number): Promise<GetTransactionsSummaryResult> {
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/transactionsSummary`, {
      year,
    });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }

    const transactionSummary = response.data;

    transactionSummary.summary.forEach(item => {
      item.updatedAt = item.updatedAt ? new Date(item.updatedAt) : null;
    });
    transactionSummary.updatedAt = new Date(transactionSummary.updatedAt);

    return {
      kind: 'ok',
      transactionSummary: transactionSummary,
    };
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
      if (problem) throw new Error(problem.kind);
    }
    const transactionCategories = response.data;
    return { kind: 'ok', transactionCategories };
  }

  async updateTransactionCategory(
    accountId: string,
    transactionId: string,
    transactionCategory: TransactionCategory
  ): Promise<UpdateTransactionCategoriesResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.post(`accounts/${accountId}/transactions/${transactionId}/transactionCategories`, [
      transactionCategory,
    ]);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const transactionCategories = response.data;
    return { kind: 'ok', transactionCategories };
  }

  async associateTransaction(accountId: string, transactionId: string, invoiceId: string): Promise<AssociateTransactionResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.put(`accounts/${accountId}/transactions/${transactionId}/invoices/${invoiceId}`);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const transaction = response.data;
    return { kind: 'ok', transaction };
  }
}
