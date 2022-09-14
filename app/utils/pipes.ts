export const currencyPipe = (currency: string): Intl.NumberFormat => {
  if (!currency) {
    return null;
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
};

export const datePipe = utcDateString =>
  utcDateString ? `${new Date(utcDateString).toLocaleDateString()} ${new Date(utcDateString).toLocaleTimeString()}` : '';
