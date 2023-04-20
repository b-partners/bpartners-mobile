import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { Header, Loader, PDFView, Screen, Text } from '../../components';
import { useStores } from '../../models';
import { NavigatorParamList, goBack } from '../../navigators';
import { color, spacing } from '../../theme';
import { ErrorBoundary } from '../error/error-boundary';

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
};

const PDF_CONTAINER: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  margin: spacing[48],
};
export const InvoicePreviewScreen: FC<StackScreenProps<NavigatorParamList, 'invoicePreview'>> = observer(props => {
  const {
    route: { params },
  } = props;
  const { fileId } = params;
  __DEV__ && console.tron.log(fileId);
  const { authStore } = useStores();

  return (
    <ErrorBoundary catchErrors={'always'}>
      <Header leftIcon={'back'} headerText={'Invoice Preview'} onLeftPress={() => goBack()} />
      <Screen style={ROOT} preset='scroll'>
        <Text preset='header' text='invoicePreview' />
        <View style={PDF_CONTAINER}>
          <PDFView
            style={{ borderWidth: 2, borderColor: color.palette.angry }}
            source={{ uri: 'https://calendar.hei.school' }}
            renderActivityIndicator={progress => {
              __DEV__ && console.tron.log(progress);
              return <Loader size={'large'} color={color.palette.deepPurple} />;
            }}
            onError={error => {
              __DEV__ && console.tron.log('An errror occured');
              __DEV__ && console.tron.log(error.message);
            }}
            onLoadComplete={() => __DEV__ && console.tron.log('compolete')}
          />
        </View>
      </Screen>
    </ErrorBoundary>
  );
});
