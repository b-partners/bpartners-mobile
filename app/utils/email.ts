import Mailer from 'react-native-mail';

type TAttachment = {
  path?: string; // Specify either 'path' or 'uri'
  uri?: string;
  type?: string; // Specify either 'type' or 'mimeType'
  mimeType?: string;
  name?: string;
};

type SendEmailParams = {
  subject?: string;
  recipients?: string[];
  ccRecipients?: string[];
  bccRecipients?: string[];
  body?: string;
  customChooserTitle?: string;
  isHTML?: boolean;
  attachments?: TAttachment[];
};

export const sendEmail = (email: SendEmailParams) => {
  Mailer.mail({ ...email }, error => {
    __DEV__ && console.tron.error(error, []);
    throw new Error('An error occurred while sending mail ' + error);
  });
};
