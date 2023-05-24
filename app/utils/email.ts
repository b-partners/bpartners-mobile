import * as MailCompose from 'expo-mail-composer';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TAttachment = {
  path?: string; // Specify either 'path' or 'uri'
  uri?: string;
  type?: string; // Specify either 'type' or 'mimeType'
  mimeType?: string;
  name?: string;
};

// This interface need to be as stable as possible to avoid breaking change
type SendEmailParams = {
  subject?: string;
  recipients?: string[];
  ccRecipients?: string[];
  bccRecipients?: string[];
  body?: string;
  isHTML?: boolean;
  attachments?: string[];
};

export const sendEmail = async (email: SendEmailParams) => {
  try {
    await MailCompose.composeAsync({ ...email });
  } catch (e) {
    __DEV__ && console.tron.error(e.message, e.stacktrace);
  }
};
