import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import React from 'react';
import { View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { Button } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { TabNavigatorParamList } from '../../../navigators';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../styles';

type InvoiceCreationProps = {
  navigation: MaterialTopTabNavigationProp<TabNavigatorParamList, 'invoices', undefined>;
  navigationState: boolean;
  setNavigationState: React.Dispatch<React.SetStateAction<boolean>>;
};
export const InvoiceCreationButton: React.FC<InvoiceCreationProps> = props => {
  const { navigationState, setNavigationState, navigation } = props;
  const { invoiceStore } = useStores();

  return (
    <View style={{ width: '75%', justifyContent: 'center', height: '100%' }}>
      {navigationState ? (
        <Snackbar
          visible={navigationState}
          elevation={5}
          style={{
            backgroundColor: palette.yellow,
            borderRadius: 40,
            paddingHorizontal: spacing[2],
            width: '90%',
            height: 50,
          }}
          onDismiss={() => setNavigationState(false)}
        >
          {translate('common.loading')}
        </Snackbar>
      ) : (
        <Button
          tx='quotationScreen.createQuotation'
          style={BUTTON_INVOICE_STYLE}
          textStyle={BUTTON_TEXT_STYLE}
          onPress={() => {
            invoiceStore.saveInvoiceInit();
            navigation.navigate('invoiceForm');
          }}
        />
      )}
    </View>
  );
};
