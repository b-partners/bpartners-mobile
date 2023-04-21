import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { Header, Loader, PDFView } from '../../components';
import { NavigatorParamList, goBack } from '../../navigators';
import { spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';

const PDF_STYLE: ViewStyle = {
  flex: 1,
  padding: spacing[4],
};

export const InvoicePreviewScreen: FC<StackScreenProps<NavigatorParamList, 'invoicePreview'>> = observer(props => {
  const {
    route: { params },
  } = props;
  //const { fileId } = params;
  //createFileUrl(fileId);
  // todo: programmatically reference pdf url

  return (
    <ErrorBoundary catchErrors={'always'}>
      <Header leftIcon={'back'} headerText={'Invoice Preview'} onLeftPress={goBack} />
      <View style={{ flex: 1 }}>
        <PDFView
          style={PDF_STYLE}
          enablePaging={false}
          // TODO replace this to the invoice pdf link
          source={{ uri: 'https://www.africau.edu/images/default/sample.pdf' }}
          renderActivityIndicator={() => <Loader size={'small'} color={palette.greyDarker} />}
          onError={error => {
            __DEV__ && console.tron.log('An errror occured');
            __DEV__ && console.tron.log(error.message);
          }}
          onLoadComplete={() => __DEV__ && console.tron.log('compolete')}
        />
      </View>
    </ErrorBoundary>
  );
});
