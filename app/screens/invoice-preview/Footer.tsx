import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Mailer from 'react-native-mail';

import { Icon, Text, TextField } from '../../components';
import { useStores } from '../../models';
import { Invoice } from '../../models/entities/invoice/invoice';
import { color, spacing } from '../../theme';
import { fetchBinaryFiles } from '../../utils/file-utils';

const ACTION_CONTAINER: ViewStyle = { flexDirection: 'row' };
const EMAIL_FIELD_CONTAINER: ViewStyle = {};
const EMAIL_COPY_CONTAINER: ViewStyle = {};
const SEND_INVOICE_BUTTON_STYLE: ViewStyle = {
  backgroundColor: color.palette.secondaryColor,
  borderRadius: 25,
  marginLeft: 15,
  flex: 1,
  marginTop: spacing[6],
};
const BUTTON_STYLE: ViewStyle = {
  flex: 1,
  padding: 0,
  borderWidth: 2,
  borderColor: color.primary,
  borderRadius: 50,
};
type IFooter = {
  invoice: Invoice;
  invoiceUrl: string;
};
const Footer: FC<IFooter> = props => {
  const {
    invoice: { title, customer },
    invoiceUrl,
  } = props;
  const {
    authStore: { accessToken },
  } = useStores();

  async function handleSendInvoice() {
    // TODO: extract an utility function
    const dirs = ReactNativeBlobUtil.fs.dirs;
    let downloadedFilePath = null;
    ReactNativeBlobUtil.config({
      fileCache: true,
      path: dirs.DownloadDir + `/Invoice-${title}.pdf`,
      overwrite: true,
    })
      .fetch('GET', invoiceUrl, {
        // some headers ..
      })
      .then(res => {
        __DEV__ && console.tron.log('The file saved to ', res.path());
        downloadedFilePath = res.path();
      });

    // Open mail client and preload with some default values
    // and pass as attachment the pdf
    const email = {
      subject: `Facture No.${title}`,
      recipients: ['customer.email'],
      body: '<p>Ci-joint la facture</p>',
      isHTML: true,
      attachments: [
        {
          path: downloadedFilePath,
          type: 'pdf',
          name: 'Invoice.pdf',
        },
      ],
    };
    Mailer.mail(email, error => {
      if (error) {
        __DEV__ && console.tron.error('Could not send email', error);
      } else {
        __DEV__ && console.tron.log('Email sent successfully');
      }
    });
  }

  async function download() {
    // TODO: extract an utility function
    __DEV__ && console.tron.log('download started');
    const dirs = ReactNativeBlobUtil.fs.dirs;
    ReactNativeBlobUtil.config({
      fileCache: true,
      path: dirs.LegacyDownloadDir + `/Invoice.pdf`,
      overwrite: true,
    })
      .fetch('GET', invoiceUrl, {})
      .then(
        res => {
          __DEV__ && console.tron.log('The file saved to ', res.path());
        },
        reason => {
          __DEV__ && console.tron.log('an error occured');
          __DEV__ && console.tron.log(reason);
        }
      );
  }

  return (
    <View>
      <View style={ACTION_CONTAINER}>
        <TouchableOpacity style={BUTTON_STYLE}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons name='delete-outline' size={24} color={color.primary} />
            <Text tx={'invoicePreviewScreen.delete'} style={{ color: color.primary }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={BUTTON_STYLE}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons name='edit' size={24} color={color.primary} />
            <Text tx={'invoicePreviewScreen.edit'} style={{ color: color.primary }} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={download}>
          <AntDesign name='download' size={24} color={color.primary} onPressIn={download} />
        </TouchableOpacity>
      </View>
      <View style={EMAIL_FIELD_CONTAINER}>
        <TextField
          textContentType={'emailAddress'}
          keyboardType={'email-address'}
          style={{ width: '70%', borderColor: color.palette.textClassicColor }}
          placeholder={'user@mail.com'}
        />
      </View>
      <View style={EMAIL_COPY_CONTAINER} />
      <TouchableOpacity style={SEND_INVOICE_BUTTON_STYLE} onPress={handleSendInvoice}>
        {/*TODO use text style */}
        <View style={{ flexDirection: 'row' }}>
          <MaterialIcons name={'send'} />
          <Text tx={'invoicePreview.send'} />
        </View>
      </TouchableOpacity>
      {/*<Button*/}
      {/*  tx='invoicePreviewScreen.sendInvoice'*/}
      {/*  onPress={handleInvoicePreviewPress}*/}
      {/*  textStyle={{*/}
      {/*    color: color.palette.white,*/}
      {/*    fontSize: 14,*/}
      {/*    fontFamily: 'Geometria-Bold',*/}
      {/*  }}*/}
      {/*/>*/}
    </View>
  );
};

export default Footer;
