import { AntDesign, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import React, { FC, useEffect, useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Mailer from 'react-native-mail';

import { Loader, Text, TextField } from '../../components';
import { useStores } from '../../models';
import { Invoice } from '../../models/entities/invoice/invoice';
import { goBack } from '../../navigators';
import { color, spacing } from '../../theme';
import { fetchBinaryFileV2 } from '../../utils/file-utils';

const ACTION_CONTAINER: ViewStyle = { flexDirection: 'row' };
const EMAIL_FIELD_CONTAINER: ViewStyle = {};
const EMAIL_COPY_CONTAINER: ViewStyle = {};
const BUTTON_CONTAINER_STYLE: ViewStyle = {
  padding: 0,
  borderWidth: 1,
  borderColor: color.primary,
  borderRadius: 45,
  width: 131,
};
const SEND_INVOICE_BUTTON_STYLE: ViewStyle = {
  backgroundColor: color.palette.secondaryColor,
  borderRadius: 25,
  marginLeft: 15,
  flex: 1,
  marginTop: spacing[6],
  ...BUTTON_CONTAINER_STYLE,
};

type IFooter = {
  invoice: Invoice;
  invoiceUrl: string;
};
const BUTTON_TEXT_STYLE: TextStyle = { color: color.primary, marginLeft: spacing[1] };
const BUTTON_STYLE: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[4],
};
const DOWNLOAD_BUTTON_STYLE: ViewStyle = {
  borderWidth: 1,
  width: 48,
  height: 48,
  borderRadius: 24,
  borderColor: color.primary,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#171717',
  shadowOffset: { width: -4, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
};

type TDownloadButton = { onPress: () => Promise<void>; loading: boolean; downloadFinished: boolean; downloadError };

function DownloadButton(props: TDownloadButton) {
  const { downloadFinished, loading, onPress, downloadError } = props;
  if (loading) {
    return (
      <TouchableOpacity style={{ ...DOWNLOAD_BUTTON_STYLE }} onPress={onPress}>
        <Loader size={'small'} color={color.palette.black} />
      </TouchableOpacity>
    );
  }
  if (downloadError) {
    return (
      <TouchableOpacity style={{ ...DOWNLOAD_BUTTON_STYLE, backgroundColor: color.palette.angry }} onPress={onPress}>
        <Ionicons name='reload' size={24} color={color.palette.white} />
      </TouchableOpacity>
    );
  }
  if (!loading && downloadFinished) {
    return (
      <TouchableOpacity style={{ ...DOWNLOAD_BUTTON_STYLE, backgroundColor: color.primary }} onPress={onPress} disabled={true}>
        <Octicons name='check' size={24} color={color.palette.white} />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={{ ...DOWNLOAD_BUTTON_STYLE }} onPress={onPress}>
      <AntDesign name='download' size={24} color={color.primary} />
    </TouchableOpacity>
  );
}

const Footer: FC<IFooter> = props => {
  const {
    invoice: { title, customer },
    invoiceUrl,
  } = props;
  const {
    authStore: { accessToken },
  } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [downloadFinished, setDownloadFinished] = useState(false);

  async function handleSendInvoice() {
    const downloadedFileTempPath = await fetchBinaryFileV2({
      url: invoiceUrl,
      fileName: `/Invoice-${title}.pdf`,
      temp: true,
    });

    // Open mail client and preload with some default values
    // and pass as attachment the pdf
    const email = {
      subject: `Facture No.${title}`,
      recipients: [customer.email],
      body: '<p>Ci-joint la facture</p>',
      isHTML: true,
      attachments: [
        {
          path: downloadedFileTempPath,
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
    setIsLoading(true);
    try {
      await fetchBinaryFileV2({
        fileName: 'Invoice.pdf',
        mimeType: 'application/pdf',
        url: invoiceUrl,
        accessToken,
        temp: false,
      });
      setDownloadFinished(true);
      setIsLoading(false);
    } catch (e) {
      setDownloadError(true);
      setIsLoading(false);
    }
  }
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.palette.white,
        paddingHorizontal: spacing[4],
        paddingTop: spacing[3],
      }}
    >
      <View style={ACTION_CONTAINER}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity style={[BUTTON_CONTAINER_STYLE, { marginRight: spacing[3] }]}>
            <View style={BUTTON_STYLE}>
              <MaterialIcons name='delete-outline' size={24} color={color.primary} />
              <Text tx={'invoicePreviewScreen.delete'} style={BUTTON_TEXT_STYLE} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={BUTTON_CONTAINER_STYLE} onPress={goBack}>
            <View style={BUTTON_STYLE}>
              <Octicons name='pencil' size={24} color={color.primary} />
              <Text tx={'invoicePreviewScreen.edit'} style={BUTTON_TEXT_STYLE} />
            </View>
          </TouchableOpacity>
        </View>
        <DownloadButton onPress={download} loading={isLoading} downloadFinished={downloadFinished} downloadError={downloadError} />
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
        <View style={{ flexDirection: 'row' }}>
          <MaterialIcons name={'send'} color={color.palette.white} />
          <Text tx={'invoicePreviewScreen.send'} style={BUTTON_TEXT_STYLE} />
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
