export const currencyPipe = currency => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
};

export const datePipe = utcDateString => `${new Date(utcDateString).toLocaleDateString()} ${new Date(utcDateString).toLocaleTimeString()}`;
