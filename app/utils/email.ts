import ReactNativeBlobUtil from 'react-native-blob-util';
import Mailer from 'react-native-mail';

import { translate } from '../i18n';
import { Invoice } from '../models/entities/invoice/invoice';
import { createFileUrl } from './file-utils';

type TEmail = {
  recipients: string[];
  subject: string;
  body: string;
};
type TAttachment = {
  fileName: string;
};
type TSendEmail = {
  invoice: Invoice;
  email: TEmail;
  attachment?: TAttachment;
};

/*export function sendEmail(params: TSendEmail) {
  const { email, invoice, attachment } = params;
  const { subject, recipients, body } = params.email;

  const dirs = ReactNativeBlobUtil.fs.dirs;
  let downloadedFilePath = null;

  ReactNativeBlobUtil.config({
    fileCache: true,
    path: dirs.DownloadDir + `/${fileName}`,
    overwrite: true,
  })
    .fetch('GET', invoiceUrl, {})
    .then(res => {
      __DEV__ && console.tron.log('The file saved to ', res.path());
      downloadedFilePath = res.path();
      const email = {
        subject: `${translate('invoicePreviewScreen.invoice')} ${sub}`,
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

      // Open mail client and preload with some default values
      // and pass as attachment the pdf
      Mailer.mail(email, error => {
        if (error) {
          __DEV__ && console.tron.error('Could not send email: ' + error, error);
        } else {
          __DEV__ && console.tron.log('Email sent successfully');
        }
      });
    });
}*/
