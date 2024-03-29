import { FontAwesome, Octicons } from '@expo/vector-icons';
import React, { FC, useEffect, useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Invoice, InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { goBack } from '../../../navigators/navigation-utilities';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { sendEmail } from '../../../utils/core/invoicing-utils';
import { fetchBinaryFiles } from '../../../utils/file-utils';
import { showMessage } from '../../../utils/snackbar';
import { DownloadButton } from './DownloadButton';

const ACTION_CONTAINER: ViewStyle = { flexDirection: 'row' };
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EMAIL_FIELD_CONTAINER: ViewStyle = { marginTop: spacing[3] };
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EMAIL_COPY_CONTAINER: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignContent: 'center',
};
const BUTTON_CONTAINER_STYLE: ViewStyle = {
  padding: 0,
  borderWidth: 1,
  borderColor: color.primary,
  borderRadius: 45,
  width: 131,
};
const SEND_INVOICE_BUTTON_STYLE: ViewStyle = {
  ...BUTTON_CONTAINER_STYLE,
  backgroundColor: color.palette.secondaryColor,
  marginTop: spacing[6],
  flex: 1,
  width: '100%',
};

type IFooter = {
  invoice: Invoice;
  invoiceUrl: string;
  situation: boolean;
};
const BUTTON_TEXT_STYLE: TextStyle = { color: color.primary, marginLeft: spacing[1] };
const BUTTON_STYLE: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[4],
};

const FOOTER_WRAPPER: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: color.palette.white,
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[4],
};
// TODO: What concretely those other button is use for
const Footer: FC<IFooter> = props => {
  const {
    invoice: { title },
    invoiceUrl,
    situation,
    invoice,
  } = props;
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sendCopy, setSendCopy] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [downloadFinished, setDownloadFinished] = useState(false);
  const fileName = `${translate('invoicePreviewScreen.invoice')}-${title}.pdf`;

  const { authStore, invoiceStore } = useStores();
  useEffect(() => {
    setDownloadFinished(false);
    setDownloadError(false);
    setIsLoading(false);
  }, [invoice]);

  async function handleSendInvoice() {
    if (invoice.status !== InvoiceStatus.DRAFT) {
      await sendEmail(authStore, invoiceStore, invoice);
    } else {
      showMessage(translate('errors.sendDraft'), { backgroundColor: palette.yellow });
    }
  }

  async function download() {
    setIsLoading(true);
    try {
      const downloadResult = await fetchBinaryFiles({ url: invoiceUrl, fileName });
      __DEV__ && console.tron.log(downloadResult);
      setDownloadFinished(true);
      setIsLoading(false);

      const dirs = ReactNativeBlobUtil.fs.dirs;
      let downloadedFilePath = null;

      ReactNativeBlobUtil.config({
        fileCache: true,
        path: dirs.DownloadDir + `/${fileName}`,
        overwrite: true,
      })
        .fetch('GET', invoiceUrl, {})
        .then(res => {
          downloadedFilePath = res.path();
          __DEV__ && console.tron.log('downloadedFilePath', downloadedFilePath);
          let thePath = downloadedFilePath.split('/').slice(-2).join('/');
          showMessage(translate('invoicePreviewScreen.savedFile') + ' ' + thePath, {
            duration: 9000,
            backgroundColor: palette.green,
          });
        });
    } catch (e) {
      __DEV__ && console.tron.log(e);
      setDownloadError(true);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={FOOTER_WRAPPER}>
      <View style={ACTION_CONTAINER}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/*<TouchableOpacity style={[BUTTON_CONTAINER_STYLE, { marginRight: spacing[3] }]}>*/}
          {/*  <View style={BUTTON_STYLE}>*/}
          {/*    <MaterialIcons name='delete-outline' size={24} color={color.primary} />*/}
          {/*    <Text tx={'invoicePreviewScreen.delete'} style={BUTTON_TEXT_STYLE} />*/}
          {/*  </View>*/}
          {/*</TouchableOpacity>*/}
          {situation && (
            <TouchableOpacity style={BUTTON_CONTAINER_STYLE} onPress={goBack}>
              <View style={BUTTON_STYLE}>
                <Octicons name='pencil' size={24} color={color.primary} />
                <Text tx={'invoicePreviewScreen.edit'} style={BUTTON_TEXT_STYLE} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <DownloadButton onPress={download} loading={isLoading} downloadFinished={downloadFinished} downloadError={downloadError} />
      </View>
      {/*<View style={EMAIL_FIELD_CONTAINER}>*/}
      {/*  <TextField*/}
      {/*    label={'Email'}*/}
      {/*    textContentType={'emailAddress'}*/}
      {/*    keyboardType={'email-address'}*/}
      {/*    style={{ width: '70%', borderColor: color.palette.lighterGrey }}*/}
      {/*    inputStyle={{ color: color.palette.textClassicColor }}*/}
      {/*    placeholder={'user@mail.com'}*/}
      {/*  />*/}
      {/*</View>*/}
      <View>
        {/*<View style={EMAIL_COPY_CONTAINER}>*/}
        {/*  <Text tx={'invoicePreviewScreen.action.sendMeACopy'} style={{ color: color.palette.textClassicColor }} />*/}
        {/*  <Switch value={sendCopy} onToggle={newValue => setSendCopy(newValue)} />*/}
        {/*</View>*/}
        {/*<TouchableOpacity*/}
        {/*  style={{*/}
        {/*    ...BUTTON_CONTAINER_STYLE,*/}
        {/*    ...BUTTON_STYLE,*/}
        {/*    width: 'auto',*/}
        {/*    flexDirection: 'row',*/}
        {/*    justifyContent: 'center',*/}
        {/*    alignItems: 'center',*/}
        {/*    alignSelf: 'flex-end',*/}
        {/*    marginTop: spacing[3],*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <AntDesign name={'mail'} color={color.primary} size={24} />*/}
        {/*  <Text tx={'invoicePreviewScreen.action.sendTestEmail'} style={{ color: color.primary, marginLeft: spacing[2] }} />*/}
        {/*</TouchableOpacity>*/}
      </View>
      {situation && (
        <TouchableOpacity style={SEND_INVOICE_BUTTON_STYLE} onPress={handleSendInvoice}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', ...BUTTON_STYLE }}>
            <FontAwesome name={'send'} color={color.palette.white} />
            <Text tx={'invoicePreviewScreen.send'} style={{ ...BUTTON_TEXT_STYLE, color: color.palette.white }} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Footer;
