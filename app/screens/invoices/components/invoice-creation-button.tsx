import React from 'react';
import { View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { Button } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { BUTTON_TEXT_STYLE, SHADOW_STYLE, invoiceCreationButtonStyles as styles } from '../utils/styles';
import { InvoiceCreationProps } from '../utils/utils';

export const InvoiceCreationButton: React.FC<InvoiceCreationProps> = props => {
  const { navigationState, setNavigationState, navigation, invoiceStatus } = props;
  const { invoiceStore } = useStores();

  return (
    <View style={styles.container}>
      {navigationState ? (
        <Snackbar visible={navigationState} elevation={5} style={styles.snackbar} onDismiss={() => setNavigationState(false)}>
          {translate('common.loading')}
        </Snackbar>
      ) : (
        <Button
          tx='quotationScreen.createQuotation'
          style={{
            ...SHADOW_STYLE,
            backgroundColor: palette.secondaryColor,
            marginVertical: spacing[1],
            marginHorizontal: spacing[1],
            borderRadius: 8,
            paddingVertical: spacing[3],
            paddingHorizontal: spacing[2],
          }}
          textStyle={BUTTON_TEXT_STYLE}
          onPress={() => {
            invoiceStore.saveInvoiceInit();
            invoiceStatus === InvoiceStatus.PROPOSAL
              ? navigation.navigate('invoiceForm', { initialStatus: InvoiceStatus.PROPOSAL })
              : invoiceStatus === InvoiceStatus.CONFIRMED
                ? navigation.navigate('invoiceForm', { initialStatus: InvoiceStatus.CONFIRMED })
                : navigation.navigate('invoiceForm', { initialStatus: InvoiceStatus.DRAFT });
          }}
        />
      )}
    </View>
  );
};
