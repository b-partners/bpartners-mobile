import * as MailCompose from 'expo-mail-composer';
import { Alert } from 'react-native';

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

export const sendEmail = async (email: SendEmailParams) => {
  let mailIsAvailable = false;
  try {
    mailIsAvailable = await MailCompose.isAvailableAsync();
    await MailCompose.composeAsync({ ...email });
  } catch (e) {
    __DEV__ && console.tron.error(e.message, e.stacktrace);
    if (!mailIsAvailable) {
      const title = translate('components.mailAlert.noMailClientFound.title');
      const message = translate('components.mailAlert.noMailClientFound.message');
      Alert.alert(title, message);
    } else {
      Alert.alert("Une érreure s'est produite", e.message);
    }
    sendError(e);
    throw e;
  }
};
