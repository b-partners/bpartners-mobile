import { ApiResponse } from 'apisauce';
import { Api } from './api';
import { GetTransactionsResult } from './api.types';
import { getGeneralApiProblem } from './api-problem';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class TransactionApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getTransactions(): Promise<GetTransactionsResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get('transactions');
      const accessToken = await AsyncStorage.getItem('token');
      console.log(accessToken);

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
}
