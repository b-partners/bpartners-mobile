export const RTLog = (...args) => {
  return __DEV__ && console.tron.log(...args);
};

export const RTError = (text, error) => {
  return __DEV__ && console.tron.error(text, error);
};
