export const commaToDot = (numberString: string): number | undefined => {
  const numberWithPoint = numberString.replace(',', '.');
  const convertedNumber = parseFloat(numberWithPoint);
  if (isNaN(convertedNumber)) {
    return undefined;
  }
  return convertedNumber;
};

export const commaValidation = (unitPrice: string): boolean => {
  const numberWithPoint = unitPrice.replace(',', '.');
  const regex = /^\d+(\.\d+)?$/;
  const isValid = regex.test(numberWithPoint);

  return isValid;
};
