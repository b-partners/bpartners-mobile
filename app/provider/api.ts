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

import { getAxiosInstance } from '../config/axios';
import env from '../config/env';
import { storage } from '../utils/storage';

const getCachedAuthConf = async () => {
  const accessToken = await storage.loadAccessToken();

  let basePath = env.apiBaseUrl;

  if (`${basePath}`.endsWith('/')) {
    basePath = basePath.slice(0, basePath.length - 1);
  }

  const conf = new Configuration({ accessToken, basePath });
  conf.baseOptions = { headers: { Authorization: `Bearer ${accessToken}` } };
  return conf;
};

export const securityApi = async () => new SecurityApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const userAccountsApi = async () => new UserAccountsApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const payingApi = async () => new PayingApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const customerApi = async () => new CustomersApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const fileApi = async () => new FilesApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const prospectingApi = async () => new ProspectingApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const onboardingApi = async () => new OnboardingApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const calendarApi = async () => new CalendarApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const sheetApi = async () => new SheetApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const mailingApi = async () => new MailingApi(await getCachedAuthConf(), undefined, getAxiosInstance());
export const areaPictureApi = async () => new AreaPictureApi(await getCachedAuthConf(), undefined, getAxiosInstance());
