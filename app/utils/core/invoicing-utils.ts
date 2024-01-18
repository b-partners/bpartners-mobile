import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { Invoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { AuthStore } from '../../models/stores/auth-store/auth-store';
import { InvoiceStore } from '../../models/stores/invoice-store/invoice-store';
import { sendError } from '../../services/logs/logs';
import { sendEmail as sendInvoiceAttachment } from '../email';
import { createFileUrl } from '../file-utils';
import { convertPlainTextToHTML } from '../text-to-html';

function formatMailBody(bodyMessage: string) {
  // email body as html does not work perfectly on android
  // https://docs.expo.dev/versions/latest/sdk/mail-composer/#mailcomposercomposeasyncoptions
  return Platform.OS === 'android' ? bodyMessage : `<p>${bodyMessage}</p>`;
}

// Used to send an invoice attachment
export async function sendEmail(
  authStore: AuthStore,
  invoiceStore: InvoiceStore,
  invoice: Invoice,
  isInvoice?: boolean,
  isRelaunch?: boolean,
  relaunchDate?: string
) {
  const { accessToken, currentAccount, currentAccountHolder } = authStore;
  const { fileId, customer, title } = invoice;
  const fileName = `${invoice.title}.pdf`;
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

  const bodyQuotationMessage = `Bonjour ${customer?.lastName},
  
Dans la continuité de notre échange, vous trouverez ci-joint le devis.

Dès réception de votre bon pour accord, je vous contacterai pour organiser la prestation.

Dans cette attente,

${currentAccountHolder.name}
${currentAccount.name}
${currentAccountHolder.companyInfo.phone}`;

  const bodyInvoiceMessage = `Bonjour ${customer?.lastName},

Dans la continuité de notre échange, vous trouverez ci-joint la facture. 

Je vous prie de bien vouloir procéder au paiement en scan le qr code, en cliquant sur le lien de paiement ou par virement classique.

Dans cette attente,

${currentAccountHolder.name}
${currentAccount.name}
${currentAccountHolder.companyInfo.phone}`;

  const bodyQuotationRelaunchMessage = `Bonjour ${customer?.lastName},
  
Nous espérons que vous allez bien.
  
Dans la continuité de notre échange, je vous ai fait parvenir ${isInvoice ? 'une facture' : 'un devis'} le ${relaunchDate}. Avez-vous pu le parcourir ? 

Dès réception de votre bon pour accord, un technicien vous contactera afin d’organiser une intervention dans les plus brefs délais.
  
Nous restons à votre entière disposition pour tous renseignements complémentaires.

Vous remerciant pour votre confiance.

${currentAccountHolder.name}
${currentAccount.name}
${currentAccountHolder.companyInfo.phone}`;

  const bodyInvoiceRelaunchMessage = `Bonjour ${customer?.lastName},
  
Nous espérons que vous allez bien.

Nous revenons vers vous concernant la facture ${invoice.ref} que nous vous avons envoyé pour paiement le ${relaunchDate}.

Si ce n'est pas déjà fait, pourriez vous svp procéder au paiement en scannant le qr code de la facture, en cliquant sur le lien ou par virement classique.

Pouvez-vous, svp, me confirmer par mail ou par téléphone la mise en paiement de la facture.

Nous restons disponible pour toute question.
Bien à vous

${currentAccountHolder.name}
${currentAccount.name}
${currentAccountHolder.companyInfo.phone}`;

  const body = formatMailBody(
    !isRelaunch && invoice.status === InvoiceStatus.PROPOSAL
      ? bodyQuotationMessage
      : isRelaunch && invoice.status === InvoiceStatus.PROPOSAL
        ? bodyQuotationRelaunchMessage
        : isRelaunch === false && invoice.status !== InvoiceStatus.PROPOSAL
          ? bodyInvoiceMessage
          : bodyInvoiceRelaunchMessage
  );
  const emailToSend = {
    subject: `[${currentAccountHolder.name}] - ${title} - ${customer.lastName}`,
    recipients: [customer.email],
    // TODO add current account holder email
    ccRecipients: [],
    body: body,
    isHTML: true,
    attachments: [downloadedFileUri],
  };
  const payload = {
    attachments: [],
    subject: `[${currentAccountHolder.name}] - ${title} - ${customer.lastName}`,
    message: convertPlainTextToHTML(body),
    isFromScratch: true,
  };

  try {
    await invoiceStore.relaunchInvoice(invoice.id, payload);
    await sendInvoiceAttachment(emailToSend);
  } catch (e) {
    sendError(e, { email: emailToSend });
    __DEV__ && console.tron.log(e.message);
  }
}
