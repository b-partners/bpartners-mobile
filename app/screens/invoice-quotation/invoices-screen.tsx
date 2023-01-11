import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { SectionList, View } from "react-native";

import { Screen, Separator, Text } from "../../components";
import { MenuItem } from "../../components/menu/menu";
import env from "../../config/env";
import { translate } from "../../i18n";
import { useStores } from "../../models";
import { Invoice as IInvoice } from "../../models/entities/invoice/invoice";
import { NavigatorParamList } from "../../navigators";
import { spacing } from "../../theme";
import { palette } from "../../theme/palette";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { fetchBinaryFile } from "../../utils/fetch-binary-file";
import { showMessage } from "../../utils/snackbar";
import { ErrorBoundary } from "../error/error-boundary";
import { Invoice } from "./components/invoice";
import { CONTAINER, FOOTER_COMPONENT_STYLE, FULL, SECTION_HEADER_TEXT_STYLE, SEPARATOR_STYLE } from "./styles";
import { sectionInvoicesByMonth } from "./utils/section-quotation-by-month";

export const InvoicesScreen: FC<MaterialTopTabScreenProps<NavigatorParamList, 'invoices'>> = observer(function InvoicesScreen() {
  const { invoiceStore, authStore } = useStores();
  const { invoices, loading } = invoiceStore;
  const { currentAccount, accessToken } = authStore;

  const sectionedQuotations = sectionInvoicesByMonth(invoices);
  const items: MenuItem[] = [{ id: 'downloadInvoice', title: translate('invoiceScreen.menu.downloadInvoice') }];

  const downloadInvoice = async (url: string, fileName: string) => {
    try {
      showMessage(translate('invoiceScreen.messages.downloadingInvoice'));
      await fetchBinaryFile({
        url,
        fileName,
      });
      showMessage(translate('invoiceScreen.messages.invoiceSuccessfullyDownload'));
    } catch (e) {
      showMessage(translate('invoiceScreen.messages.downloadingInvoiceFailed'));
      __DEV__ && console.tron.log(e);
      throw e;
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={FULL}>
        <Screen style={CONTAINER} preset='auto' backgroundColor={palette.white}>
          <SectionList<IInvoice>
            style={{ marginHorizontal: spacing[4] }}
            sections={[...sectionedQuotations]}
            renderItem={({ item }) => (
              <Invoice
                item={item}
                menuItems={items}
                menuAction={{
                  downloadInvoice: () =>
                    downloadInvoice(`${env.apiBaseUrl}/accounts/${currentAccount.id}/files/${item.fileId}/raw?accessToken=${accessToken}`, `${item.ref}.pdf`),
                }}
              />
            )}
            keyExtractor={item => item.id}
            renderSectionHeader={({ section: { title } }) => <Text style={SECTION_HEADER_TEXT_STYLE}>{capitalizeFirstLetter(title)}</Text>}
            refreshing={loading}
            progressViewOffset={100}
            stickySectionHeadersEnabled={true}
            ItemSeparatorComponent={() => <Separator style={SEPARATOR_STYLE} />}
            renderSectionFooter={() => <View style={FOOTER_COMPONENT_STYLE} />}
          />
        </Screen>
      </View>
    </ErrorBoundary>
  );
});
