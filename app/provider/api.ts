import {
  AreaPictureApi,
  CalendarApi,
  Configuration,
  CustomersApi,
  FilesApi,
  MailingApi,
  OnboardingApi,
  PayingApi,
  ProspectingApi,
  SecurityApi,
  SheetApi,
  UserAccountsApi,
} from '@bpartners/typescript-client';
import 'react-native-url-polyfill/auto';

import env from '../config/env';
import { storage } from '../utils/storage';

const getCachedAuthConf = async () => {
  const accessToken = await storage.loadAccessToken();
  const conf = new Configuration({ accessToken, basePath: env.apiBaseUrl });
  conf.baseOptions = { headers: { Authorization: `Bearer ${accessToken}` } };
  return conf;
};

export const securityApi = async () => new SecurityApi(await getCachedAuthConf());
export const userAccountsApi = async () => new UserAccountsApi(await getCachedAuthConf());
export const payingApi = async () => new PayingApi(await getCachedAuthConf());
export const customerApi = async () => new CustomersApi(await getCachedAuthConf());
export const fileApi = async () => new FilesApi(await getCachedAuthConf());
export const prospectingApi = async () => new ProspectingApi(await getCachedAuthConf());
export const onboardingApi = async () => new OnboardingApi(await getCachedAuthConf());
export const calendarApi = async () => new CalendarApi(await getCachedAuthConf());
export const sheetApi = async () => new SheetApi(await getCachedAuthConf());
export const mailingApi = async () => new MailingApi(await getCachedAuthConf());
export const areaPictureApi = async () => new AreaPictureApi(await getCachedAuthConf());
