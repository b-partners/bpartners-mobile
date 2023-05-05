import ReactNativeBlobUtil from 'react-native-blob-util';
import Mailer from 'react-native-mail';

export const sendInvoiceByEmail = async (invoiceUrl, title, customer, fileName) => {
  const dirs = ReactNativeBlobUtil.fs.dirs;
  let downloadedFilePath = null;

  ReactNativeBlobUtil.config({
    fileCache: true,
    path: `${dirs.DownloadDir}/${fileName}`,
    overwrite: true,
  })
    .fetch('GET', invoiceUrl, {})
    .then(res => {
      console.log('The file saved to ', res.path());
      downloadedFilePath = res.path();
      const email = {
        subject: `invoice ${title}`,
        recipients: [customer.email],
        ccRecipients: [],
        body: '<p>email body</p>',
        isHTML: true,
        attachments: [
          {
            path: downloadedFilePath,
            type: 'pdf',
            name: fileName,
          },
        ],
      };

      Mailer.mail(email, error => {
        if (error) {
          console.error('Could not send email: ' + error, error);
        } else {
          console.log('Email sent successfully');
        }
      });
    });
};
