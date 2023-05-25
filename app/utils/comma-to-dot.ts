
export const commaToDot = (numberString: string): number | undefined=> {
    const numberWithPoint = numberString.replace(',', '.');
    const convertedNumber = parseFloat(numberWithPoint);
    if (isNaN(convertedNumber)) {
        return undefined;
    }
    return convertedNumber;
}
