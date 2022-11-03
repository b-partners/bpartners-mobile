import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { FlatList, View } from 'react-native';

import { GradientBackground, Screen, Separator } from '../../components';
import { Loader } from '../../components/loader/loader';
import { MenuItem } from '../../components/menu/menu';
import env from '../../config/env';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { NavigatorParamList } from '../../navigators';
import { color } from '../../theme';
import { downloadFile } from '../../utils/download-file';
import { showMessage } from '../../utils/snackbar';
import { Invoice } from './components/invoice';
import { CONTAINER, FULL, INVOICES_STYLE, LOADER_STYLE } from './styles';

export const InvoicesScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore, authStore } = useStores();
  const { invoices, loading } = invoiceStore;
  const { currentAccount, accessToken } = authStore;

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: 30 });
    });
    return unsubscribe;
  }, [navigation]);

  const items: MenuItem[] = [{ id: 'downloadInvoice', title: translate('invoiceScreen.menu.downloadInvoice') }];

  const downloadInvoice = async (item: IInvoice) => {
    try {
      showMessage(translate('invoiceScreen.messages.downloadingInvoice'));
      await downloadFile({
        url: `${env.apiBaseUrl}/accounts/${currentAccount.id}/files/${item.fileId}/raw?accessToken=${accessToken}`,
        fileName: `${item.ref}.pdf`,
      });
      showMessage(translate('invoiceScreen.messages.invoiceSuccessfullyDownload'));
    } catch (e) {
      showMessage(translate('invoiceScreen.messages.downloadingInvoiceFailed'));
      console.tron.log(e);
      throw e;
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
              return <Invoice item={item} menuItems={items} menuAction={{ downloadInvoice: () => downloadInvoice(item) }} />;
            }}
            ItemSeparatorComponent={() => <Separator />}
          />
        ) : (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        )}
      </Screen>
    </View>
  );
});
