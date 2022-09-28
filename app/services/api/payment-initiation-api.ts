import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { InitPaymentResult } from './api.types';
import { getGeneralApiProblem } from './api-problem';
import { PaymentInitiation } from '../../models/entities/payment-initiation/payment-initiation';
import env from '../../config/env';

export class PaymentInitiationApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async init(accountId: string, payload: PaymentInitiation): Promise<InitPaymentResult> {
    try {
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
        if (problem) return problem;
      }
      const [paymentInitiation] = response.data;
      return { kind: 'ok', paymentInitiation };
    } catch (e) {
      __DEV__ && console.tron.log(e.message);
      return { kind: 'bad-data' };
    }
  }
}
