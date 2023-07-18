import * as yup from 'yup';

import { translate } from '../../../i18n';

export interface IdentityState {
  accessToken: string;
  refreshToken: string;
}

export interface UserCredentials {
  password: string;
  email: string;
}

export const LoginFormSchema = yup.object().shape({
  email: yup.string().email(translate('errors.invalidEmail')).required(translate('errors.required')),
  password: yup.string().required(translate('errors.required')),
});

export const Log = (...args) => {
  return __DEV__ && console.tron.log(...args);
};

export const Error = (text, error) => {
  return __DEV__ && console.tron.error(text, error);
};
