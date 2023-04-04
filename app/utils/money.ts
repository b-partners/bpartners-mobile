import { translate } from '../i18n';
import { currencyPipe } from './pipes';

export const amountToMinors = (amount: number) => amount * 100;

const amountToMajors = (amount: number) => amount / 100;

export const printCurrencyToMajors = (amount: number) => currencyPipe(translate('currency')).format(amountToMajors(amount));

export const printCurrency = (amount: number) => currencyPipe(translate('currency')).format(amount / 100);

export const vatToMinors = (value: number): number => value * 100;

export const printVat = (value: number): string => `${(value / 100).toFixed(2)} %`;
