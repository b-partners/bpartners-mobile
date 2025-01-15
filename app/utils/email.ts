import { Alert } from 'react-native';
import MailCompose from 'react-native-mail';

import { translate } from '../i18n';
import { sendError } from '../services/logs/logs';

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

/**
 * **[ios]** User must log in to Mail app of iPhone(the default one).
 * https://developer.apple.com/documentation/messageui/mfmailcomposeviewcontroller
 * https://github.com/expo/expo/pull/5622
 * */
export const sendEmail = async (email: SendEmailParams) => {
  const { attachments, ...emailData } = email || {};

  try {
    MailCompose.mail({ ...emailData, attachments: attachments.map(path => ({ path })) }, () => {});
  } catch (e) {
    __DEV__ && console.tron.error(e.message, e.stacktrace);
    Alert.alert(translate('errors.somethingWentWrong'), e.message);
    sendError(e);
    throw e;
  }
};
