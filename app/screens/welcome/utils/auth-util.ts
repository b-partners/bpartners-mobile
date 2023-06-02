import { Auth } from 'aws-amplify';

export const forgotPassword = async (username: string) => {
  let response;
  try {
    response = await Auth.forgotPassword(username);
    __DEV__ && console.tron.logImportant('successfuly sent');
    __DEV__ && console.tron.logImportant(response);
  } catch (e) {
    __DEV__ && console.tron.logImportant('an error occured');
    __DEV__ && console.tron.error(e, e.stackTrace);
    throw e;
  }
  return response;
};

export const resetPassword = async (username: string, confirmationCode: string, newPassword: string) => {
  let response;
  __DEV__ && console.tron.logImportant([username, confirmationCode, newPassword]);
  try {
    response = await Auth.forgotPasswordSubmit(username, confirmationCode, newPassword);
    __DEV__ && console.tron.logImportant('succesfully sent');
    __DEV__ && console.tron.logImportant(response);
  } catch (e) {
    __DEV__ && console.tron.logImportant('an error occured');
    throw e;
  }
  return response;
};
