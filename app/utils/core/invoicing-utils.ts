import ReactNativeBlobUtil from 'react-native-blob-util';
import Mailer from 'react-native-mail';

import { translate } from '../../i18n';
import { Invoice } from '../../models/entities/invoice/invoice';
import { AuthStore } from '../../models/stores/auth-store/auth-store';
import { createFileUrl } from '../file-utils';

export function sendEmail(authStore: AuthStore, invoice: Invoice) {
  const { accessToken, currentAccount } = authStore;

  const dirs = ReactNativeBlobUtil.fs.dirs;
  let downloadedFilePath = null;

  // TODO: delegate this library to the library
  const fileName = `temp.pdf`;

  const { fileId, customer, title } = invoice; // TODO: what about draft and quotation
  const invoiceUrl = createFileUrl(fileId, currentAccount.id, accessToken, 'INVOICE');
  ReactNativeBlobUtil.config({
    fileCache: true,
    path: dirs.DownloadDir + `/${fileName}`,
    overwrite: true,
  })
    .fetch('GET', invoiceUrl, {})
    .then(res => {
      __DEV__ && console.tron.log('The file saved to ', res.path());
      downloadedFilePath = res.path();
      const emailToSend = {
        subject: `${translate('invoicePreviewScreen.invoice')} ${title}`,
        recipients: [customer.email],
        // TODO add current account holder email
        ccRecipients: [],
        body: `<p>${translate('invoicePreviewScreen.email.body')}</p>`,
        isHTML: true,
        attachments: [
          {
            path: downloadedFilePath,
            type: 'pdf',
            name: fileName,
          },
        ],
      };
      __DEV__ && console.tron.log('email>' + emailToSend);
      // Open mail client and preload with some default values
      // and pass as attachment the pdf
      return Mailer.mail(emailToSend, error => {
        if (error) {
          __DEV__ && console.tron.error('Could not send email: ' + error, error);
        } else {
          __DEV__ && console.tron.log('Email sent successfully');
        }
      });
    });
}
