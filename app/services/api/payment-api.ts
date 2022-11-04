import { ApiResponse } from 'apisauce';

import env from '../../config/env';
import { Criteria } from '../../models/entities/criteria/criteria';
import { Invoice } from '../../models/entities/invoice/invoice';
import { PaymentInitiation } from '../../models/entities/payment-initiation/payment-initiation';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { CrupdateInvoiceResult, GetInvoiceResult, GetInvoicesResult, InitPaymentResult } from './api.types';

export class PaymentApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async init(accountId: string, payload: PaymentInitiation): Promise<InitPaymentResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.post(`accounts/${accountId}/paymentInitiations`, [
      {
        ...payload,
        redirectionStatusUrls: { successUrl: env.successUrl, failureUrl: env.failureUrl },
      },
    ]);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const [paymentInitiation] = response.data;
    return { kind: 'ok', paymentInitiation };
  }

  async saveInvoice(accountId: string, payload: Invoice): Promise<CrupdateInvoiceResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.put(`accounts/${accountId}/invoices/${payload.id}`, payload);
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const invoice = {
        ...response.data,
        sendingDate: new Date(response.data.sendingDate),
        toPayAt: new Date(response.data.toPayAt),
      };
      return { kind: 'ok', invoice };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }

  async getInvoice(accountId: string, invoiceId: string): Promise<GetInvoiceResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/invoices/${invoiceId}`);
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const invoice = {
        ...response.data,
        sendingDate: new Date(response.data.sendingDate),
        toPayAt: new Date(response.data.toPayAt),
      };
      return { kind: 'ok', invoice };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }

  async getInvoices(accountId: string, criteria: Criteria): Promise<GetInvoicesResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/invoices`, criteria);
      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      const invoices = response.data.map(item => ({
        ...item,
        toPayAt: new Date(item.toPayAt),
        sendingDate: new Date(item.sendingDate),
        updatedAt: item.updatedAt && new Date(item.updatedAt),
      }));
      return { kind: 'ok', invoices };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }
}
