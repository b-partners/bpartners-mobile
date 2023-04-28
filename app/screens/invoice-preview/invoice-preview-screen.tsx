import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { Header, Loader, PDFView } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { NavigatorParamList, goBack } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { createFileUrl } from '../../utils/file-utils';
import { ErrorBoundary } from '../error/error-boundary';
import Footer from './components/Footer';

const PDF_STYLE: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing[2],
  backgroundColor: color.palette.greyDarker,
};

const FULL: ViewStyle = { flex: 1 };
export const InvoicePreviewScreen: FC<StackScreenProps<NavigatorParamList, 'invoicePreview'>> = observer(props => {
  const {
    route: { params },
  } = props;
  const { fileId, invoiceTitle, invoice } = params;
  const {
    authStore: { accessToken, currentAccount },
  } = useStores();
  // TODO: what about draft and quotation
  const invoiceUrl = createFileUrl(fileId, currentAccount.id, accessToken, 'INVOICE');

  return (
    <ErrorBoundary catchErrors={'always'}>
      <Header leftIcon={'back'} headerText={translate('invoicePreviewScreen.previewOfInvoice') + invoiceTitle} onLeftPress={goBack} />
      <View style={FULL}>
        <PDFView
          style={PDF_STYLE}
          enablePaging={true}
          source={{ uri: invoiceUrl, cache: false }}
          renderActivityIndicator={() => <Loader size={'small'} color={palette.greyDarker} />}
          onError={error => {
            __DEV__ && console.tron.log('An errror occured');
            __DEV__ && console.tron.error(error.message, [error.stackTrace]);
          }}
          onLoadComplete={() => __DEV__ && console.tron.log('complete')}
        />
      </View>
      <Footer invoice={invoice} invoiceUrl={invoiceUrl} />
    </ErrorBoundary>
  );
});
