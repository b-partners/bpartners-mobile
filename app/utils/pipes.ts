export const currencyPipe = currency => {
  if (!currency) {
    return '';
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
};

export const datePipe = utcDateString =>
  utcDateString ? `${new Date(utcDateString).toLocaleDateString()} ${new Date(utcDateString).toLocaleTimeString()}` : '';
