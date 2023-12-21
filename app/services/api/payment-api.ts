import { ApiErrorResponse, ApiOkResponse, ApiResponse } from 'apisauce';

import env from '../../config/env';
import { Criteria, PageCriteria } from '../../models/entities/criteria/criteria';
import { Invoice, MethodModel } from '../../models/entities/invoice/invoice';
import { PaymentInitiation } from '../../models/entities/payment-initiation/payment-initiation';
import { Api } from './api';
import { getGeneralApiProblem } from './api-problem';
import { CrupdateInvoiceResult, GetInvoiceRelaunchResult, GetInvoiceResult, GetInvoicesResult, InitPaymentResult, InvoiceRelaunchResult } from './api.types';

export class PaymentApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  private mapInvoice(item: Invoice): Invoice {
    return {
      ...item,
      sendingDate: item.sendingDate && new Date(item.sendingDate),
      toPayAt: item.toPayAt && new Date(item.toPayAt),
      validityDate: item.validityDate && new Date(item.validityDate),
      createdAt: item.createdAt && new Date(item.createdAt),
      updatedAt: item.updatedAt && new Date(item.updatedAt),
      metadata: {
        submittedAt: item.metadata.submittedAt && new Date(item.metadata.submittedAt),
      },
      customer: {
        id: item.customer ? item.customer.id : null,
        firstName: item.customer ? item.customer.firstName : null,
        lastName: item.customer ? item.customer.lastName : null,
        address: item.customer ? item.customer.address : null,
        city: item.customer ? item.customer.city : null,
        country: item.customer ? item.customer.country : null,
        email: item.customer ? item.customer.email : null,
        phone: item.customer ? item.customer.phone : null,
        website: item.customer ? item.customer.website : null,
        zipCode: item.customer ? item.customer.zipCode : null,
        comment: item.comment ? item.comment : null,
      },
    };
  }

  private mapInvoices(response: ApiErrorResponse<Invoice[]> | ApiOkResponse<Invoice[]>) {
    return response.data.map(item => this.mapInvoice(item));
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
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.put(`accounts/${accountId}/invoices/${payload.id}`, payload);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const invoice = this.mapInvoice(response.data);
    return { kind: 'ok', invoice };
  }

  async getInvoice(accountId: string, invoiceId: string): Promise<GetInvoiceResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/invoices/${invoiceId}`);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const invoice = this.mapInvoice(response.data);
    return { kind: 'ok', invoice };
  }

  async getInvoices(accountId: string, criteria: Criteria): Promise<GetInvoicesResult> {
    // make the api call
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/invoices`, criteria);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const invoices = this.mapInvoices(response);
    return { kind: 'ok', invoices };
  }

  async updatePaymentRegulationStatus(accountId: string, invoiceId: string, paymentId: string, method: MethodModel): Promise<GetInvoiceResult> {
    const response: ApiResponse<any> = await this.api.apisauce.put(
      `accounts/${accountId}/invoices/${invoiceId}/paymentRegulations/${paymentId}/paymentMethod`,
      method
    );
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const invoice = this.mapInvoice(response.data);
    return { kind: 'ok', invoice };
  }

  async relaunchInvoice(accountId: string, invoiceId: string, payload: any): Promise<InvoiceRelaunchResult> {
    const response: ApiResponse<any> = await this.api.apisauce.post(`accounts/${accountId}/invoices/${invoiceId}/relaunch`, payload);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const invoiceRelaunch = response.data;
    return { kind: 'ok', invoiceRelaunch };
  }

  async getInvoiceRelaunches(accountId: string, invoiceId: string, pageCriteria: PageCriteria): Promise<GetInvoiceRelaunchResult> {
    const response: ApiResponse<any> = await this.api.apisauce.get(`accounts/${accountId}/invoices/${invoiceId}/relaunches`, pageCriteria);
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) throw new Error(problem.kind);
    }
    const invoiceRelaunch = response.data;
    return { kind: 'ok', invoiceRelaunch };
  }
}
