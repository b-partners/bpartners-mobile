import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import Mailer from "react-native-mail"
import RNFetchBlob from "rn-fetch-blob"

import { Icon, Text, TextField } from '../../components';
import { Invoice } from '../../models/entities/invoice/invoice';
import { color, spacing } from '../../theme';

const ACTION_CONTAINER: ViewStyle = { flexDirection: 'row' };
const EMAIL_FIELD_CONTAINER: ViewStyle = {};
const EMAIL_COPY_CONTAINER: ViewStyle = {};
const SEND_INVOICE_BUTTON_STYLE: ViewStyle = {
  backgroundColor: color.palette.secondaryColor,
  borderRadius: 25,
  marginLeft: 15,
  flex: 1,
  marginTop: spacing[6];
};
const BUTTON_STYLE: ViewStyle = {
  flex: 1,
  padding: 0,
  borderWidth: 2,
  borderColor: color.primary,
  borderRadius: 50,
}
type IFooter = {
  invoice: Invoice;
  invoiceUrl: string;
};
const Footer: FC<IFooter> = props => {
  const {
    invoice: { title },
    invoiceUrl,
  } = props;

  async function handleSendInvoice() {
    // TODO: extract an utility function
    const dirs = RNFetchBlob.fs.dirs;
    let downloadedFilePath = null;
    RNFetchBlob.config({
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
      recipients: ['john@gmail.com'],
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
    Mailer.mail(email, (error) => {
      if (error) {
        __DEV__ && console.tron.error('Could not send email', error);
      } else {
        __DEV__ && console.tron.log('Email sent successfully');
      }
    });
  }

  return (
    <View>
      <View style={ACTION_CONTAINER}>
        <TouchableOpacity style={BUTTON_STYLE}>
          <MaterialIcons name='delete-outline' size={24} color={color.primary} />
          <Text text={'Supprimer'} />
        </TouchableOpacity>
        <TouchableOpacity style={BUTTON_STYLE}>
          <Icon icon={'edit'} />
          <Text text={'modifier'} />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name='download' size={24} color={color.primary} />
        </TouchableOpacity>
      </View>
      <View style={EMAIL_FIELD_CONTAINER}>
        <Text text={'Send an email copy'} style={{ marginBottom: spacing[3] }} />
        <TextField
          textContentType={'emailAddress'}
          keyboardType={'email-address'}
          style={{ width: '70%', borderColor: color.palette.textClassicColor }}
          placeholder={'user@mail.com'}
        />
      </View>
      <View style={EMAIL_COPY_CONTAINER}></View>
      <TouchableOpacity style={SEND_INVOICE_BUTTON_STYLE} onPress={handleSendInvoice}>
        {/*TODO use text style */}
        <MaterialIcons name={"send"}/> <Text text={"Envoyer le mail"}/>
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