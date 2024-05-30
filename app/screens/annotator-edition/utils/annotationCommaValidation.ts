export const annotationCommaValidation = (unitPrice: string): boolean => {
  if (unitPrice.length === 0) {
    return true;
  }
  const numberWithPoint = unitPrice.replace(',', '.');
  const regex = /^\d+(\.\d+)?$/;
  return regex.test(numberWithPoint);
};
