/**
 * Capitalize the first letter of a string
 *
 * */
export const capitalizeFirstLetter = (letter: string): string => {
  const firstChar = letter[0].toLocaleUpperCase();
  return firstChar + letter.slice(1);
};
