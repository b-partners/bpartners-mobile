import { Auth } from 'aws-amplify';

export const forgotPassword = async (username: string, confirmationCode?: string, newPassword?: string) => {
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
