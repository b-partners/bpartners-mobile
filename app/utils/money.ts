import { translate } from '../i18n';
import { currencyPipe } from './pipes';

export const amountToMinors = (amount: number) => amount * 100;

const amountToMajors = (amount: number) => amount / 100;

export const printCurrency = (amount: number) => (amount ? currencyPipe(translate('currency')).format(amountToMajors(amount)) : null);

export const vatToMinors = (value: number): number => value * 100;

export const printVat = (value: number): string => (value ? `${(value / 100).toFixed(2)} %` : null);
