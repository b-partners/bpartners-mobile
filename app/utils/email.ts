import { translate } from '../i18n';
import { sendError } from '../services/logs/logs';
import * as MailCompose from 'expo-mail-composer';
import { Alert, Platform } from 'react-native';

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
  let mailIsAvailable = false;
  try {
    mailIsAvailable = await MailCompose.isAvailableAsync();
    await MailCompose.composeAsync({ ...email });
  } catch (e) {
    __DEV__ && console.tron.error(e.message, e.stacktrace);
    if (!mailIsAvailable) {
      const title = translate('components.mailAlert.noMailClientFound.title');
      const message =
        Platform.OS === 'ios' ? translate('components.mailAlert.noMailClientFound.iosMessage') : translate('components.mailAlert.noMailClientFound.message');

      Alert.alert(title, message);
    } else {
      Alert.alert(translate('errors.somethingWentWrong'), e.message);
    }
    sendError(e);
    throw e;
  }
};
