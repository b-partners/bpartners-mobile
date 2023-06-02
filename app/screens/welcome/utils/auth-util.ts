import { Auth } from 'aws-amplify';

export const forgotPassword = (username: string, confirmationCode: string, newPassword: string) => {
  // Send confirmation confirmationCode to user's email
  Auth.forgotPassword(username)
    .then(data => console.log(data))
    .catch(err => console.log(err));
};
