import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { translate } from '../../i18n';
import { Invoice } from '../../models/entities/invoice/invoice';
import { AuthStore } from '../../models/stores/auth-store/auth-store';
import { sendError } from '../../services/logs/logs';
import { sendEmail as sendInvoiceAttachment } from '../email';
import { createFileUrl } from '../file-utils';

function formatMailBody(bodyMessage: string) {
  // email body as html does not work perfectly on android
  // https://docs.expo.dev/versions/latest/sdk/mail-composer/#mailcomposercomposeasyncoptions
  return Platform.OS === 'android' ? bodyMessage : `<p>${bodyMessage}</p>`;
}

// Used to send an invoice attachment
export async function sendEmail(authStore: AuthStore, invoice: Invoice) {
  const { accessToken, currentAccount } = authStore;
  const { fileId, customer, title } = invoice;
  const fileName = `temp.pdf`;
  // TODO: what about draft and quotation
  const invoiceUrl = createFileUrl(fileId, currentAccount.id, accessToken, 'INVOICE');

  // Download the invoice into a cache dir of bp-app
  const fileUri = FileSystem.cacheDirectory + fileName;
  let downloadedFileUri = null;
  const downloadResumable = FileSystem.createDownloadResumable(invoiceUrl, fileUri, {});
  try {
    const { uri } = await downloadResumable.downloadAsync();
    downloadedFileUri = uri;
    __DEV__ && console.tron.log('Finished downloading to ' + uri);
  } catch (e) {
    __DEV__ && console.tron.error(e.message, e.stacktrace);
    sendError({ message: 'Error occured while downloading file: ' + fileUri, exception: e }, {});
  }

  const bodyMessage = `${translate('invoicePreviewScreen.email.body')}`;
  const body = formatMailBody(bodyMessage);
  const emailToSend = {
    subject: `${translate('invoicePreviewScreen.invoice')} ${title}`,
    recipients: [customer.email],
    // TODO add current account holder email
    ccRecipients: [],
    body: body,
    isHTML: true,
    attachments: [downloadedFileUri],
  };

  try {
    await sendInvoiceAttachment(emailToSend);
  } catch (e) {
    sendError(e, { email: emailToSend });
    __DEV__ && console.tron.log(e.message);
  }
}
