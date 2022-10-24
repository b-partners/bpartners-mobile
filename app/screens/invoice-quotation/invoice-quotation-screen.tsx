import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator, FlatList, View, ViewStyle } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '../../navigators';
import { GradientBackground, Screen, Separator } from '../../components';
import { color } from '../../theme';
import { useStores } from '../../models';
import { INVOICES_STYLE } from './styles';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { Invoice } from './components/invoice';
import { showMessage } from '../../utils/snackbar';
import { translate } from '../../i18n';

const FULL: ViewStyle = {
  flex: 1,
  position: 'relative',
};

const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  display: 'flex',
  flexDirection: 'column',
};

const ACTIVITY_INDICATOR_CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: 700,
};

export const InvoiceQuotationScreen: FC<StackScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore } = useStores();
  const { invoices, loading } = invoiceStore;

  const editInvoice = async item => {
    if (item.status !== InvoiceStatus.DRAFT) {
      return;
    }
    try {
      await invoiceStore.getInvoice(item.id);
      navigation.navigate('invoiceForm');
    } catch (e) {
      console.tron.log(`Failed to edit invoice, ${e}`);
    }
  };

  const markAsProposal = async (item: IInvoice) => {
    if (item.status === InvoiceStatus.PROPOSAL || item.status === InvoiceStatus.CONFIRMED) {
      return;
    }
    try {
      const editedItem = {
        ...item,
        ref: item.ref.replace('-TMP', ''),
        title: item.title.replace('-TMP', ''),
        status: InvoiceStatus.PROPOSAL,
      };
      await invoiceStore.saveInvoice(editedItem);
      await invoiceStore.getInvoices({ page: 1, pageSize: 15 });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsProposal'));
    } catch (e) {
      console.tron.log(`Failed to convert invoice, ${e}`);
    }
  };

  return (
    <View testID='PaymentInitiationScreen' style={FULL}>
      <GradientBackground colors={['#422443', '#281b34']} />
      <Screen style={CONTAINER} preset='auto' backgroundColor={color.transparent}>
        {!loading ? (
          <FlatList<IInvoice>
            contentContainerStyle={INVOICES_STYLE}
            data={[...invoices]}
            renderItem={({ item }) => {
              return <Invoice item={item} editInvoice={() => editInvoice(item)} markAsProposal={() => markAsProposal(item)} />;
            }}
            ItemSeparatorComponent={() => <Separator />}
          />
        ) : (
          <View style={ACTIVITY_INDICATOR_CONTAINER_STYLE}>
            <ActivityIndicator size='large' />
          </View>
        )}
      </Screen>
    </View>
  );
});
