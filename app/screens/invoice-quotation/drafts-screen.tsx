import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { SectionList, TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Button, Loader, Screen, Separator, Text } from '../../components';
import { MenuItem } from '../../components/menu/menu';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Invoice as IInvoice, InvoiceStatus } from '../../models/entities/invoice/invoice';
import { TabNavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { Invoice } from './components/invoice';
import {
  BUTTON_INVOICE_STYLE,
  BUTTON_TEXT_STYLE,
  FOOTER_COMPONENT_STYLE,
  FULL,
  LOADER_STYLE,
  SECTION_HEADER_TEXT_STYLE,
  SECTION_LIST_CONTAINER_STYLE,
  SEPARATOR_STYLE,
} from './styles';
import { navigateToTab } from './utils/reset-tab-navigation';
import { sectionInvoicesByMonth } from './utils/section-quotation-by-month';

export const DraftsScreen: FC<MaterialTopTabScreenProps<TabNavigatorParamList, 'invoices'>> = observer(function InvoicesScreen({ navigation }) {
  const { invoiceStore, draftStore, quotationStore } = useStores();
  const { drafts, loadingDraft } = draftStore;
  const [navigationState, setNavigationState] = useState(false);
  /*const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(allDrafts.length / 10));*/
  const messageOption = { backgroundColor: palette.green };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = drafts.slice(startItemIndex, endItemIndex);

  const handleRefresh = async () => {
    await draftStore.getDrafts({ page: 1, pageSize: 500, status: InvoiceStatus.DRAFT });
  };

  /*useEffect(() => {
    setPage(1);
    setMaxPage(Math.ceil(allDrafts.length / 10));
  }, [allDrafts]);

  useEffect(() => {
    draftStore.getDrafts({ page: page, pageSize: 10, status: InvoiceStatus.DRAFT });
  }, [page]);*/

  const editInvoice = async (item: IInvoice) => {
    setNavigationState(true);
    if (item.status !== InvoiceStatus.DRAFT) {
      return;
    }
    try {
      const currentInvoice = await invoiceStore.getInvoice(item.id);
      __DEV__ && console.tron.log(currentInvoice);
      invoiceStore.saveInvoiceInit();
      navigation.navigate('invoiceForm', { invoiceID: item.id, status: InvoiceStatus.DRAFT });
    } catch (e) {
      __DEV__ && console.tron.log(`Failed to edit invoice, ${e}`);
    } finally {
      setNavigationState(false);
    }
  };

  const markAsProposal = async (item: IInvoice) => {
    if (item.status === InvoiceStatus.PROPOSAL || item.status === InvoiceStatus.CONFIRMED) {
      return;
    }
    try {
      setNavigationState(true);
      const editedItem = {
        ...item,
        ref: item.ref.replace('-TMP', ''),
        title: item.title?.replace('-TMP', ''),
        status: InvoiceStatus.PROPOSAL,
      };
      navigateToTab(navigation, 'quotations');
      await invoiceStore.saveInvoice(editedItem);
      await quotationStore.getQuotations({ page: 1, pageSize: 10, status: InvoiceStatus.PROPOSAL });
      setNavigationState(false);
      await draftStore.getDrafts({ page: 1, pageSize: 10, status: InvoiceStatus.DRAFT });
      showMessage(translate('invoiceScreen.messages.successfullyMarkAsProposal'), messageOption);
    } catch (e) {
      __DEV__ && console.tron.log(`Failed to convert invoice, ${e}`);
    } finally {
      await quotationStore.getAllQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 500 });
      await draftStore.getAllDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 500 });
    }
  };
  const items: MenuItem[] = [
    { id: 'editInvoice', title: translate('invoiceScreen.menu.editDraft') },
    { id: 'markAsProposal', title: translate('invoiceScreen.menu.markAsProposal') },
  ];

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
      // If the offset is less than or equal to 0, we're at the top of the list
      handleRefresh();
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <View testID='PaymentInitiationScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        {!loadingDraft ? (
          <Screen
            style={{ backgroundColor: color.transparent, display: 'flex', flexDirection: 'column', paddingBottom: spacing[3] }}
            preset='scroll'
            backgroundColor={palette.white}
          >
            <View>
              <SectionList<IInvoice>
                style={SECTION_LIST_CONTAINER_STYLE}
                sections={[...sectionInvoicesByMonth(displayedItems)]}
                renderItem={({ item }) => (
                  <Invoice
                    item={item}
                    menuItems={items}
                    menuAction={{
                      editInvoice: () => editInvoice(item),
                      markAsProposal: () => markAsProposal(item),
                    }}
                  />
                )}
                keyExtractor={item => item.id}
                renderSectionHeader={({ section: { title } }) => <Text style={SECTION_HEADER_TEXT_STYLE}>{capitalizeFirstLetter(title)}</Text>}
                refreshing={loadingDraft}
                onRefresh={handleRefresh}
                progressViewOffset={100}
                stickySectionHeadersEnabled={true}
                ItemSeparatorComponent={() => <Separator style={SEPARATOR_STYLE} />}
                renderSectionFooter={() => <View style={FOOTER_COMPONENT_STYLE} />}
                onScrollEndDrag={handleScroll}
              />
            </View>
          </Screen>
        ) : (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        )}
        <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
          <View style={{ width: '25%', alignItems: 'center', flexDirection: 'row', height: '100%', justifyContent: 'space-evenly' }}>
            {currentPage === 1 ? (
              <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                <EntypoIcon name='chevron-thin-left' size={27} color={palette.lighterGrey} />
              </View>
            ) : (
              <TouchableOpacity
                style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setCurrentPage(currentPage - 1);
                }}
              >
                <EntypoIcon name='chevron-thin-left' size={25} color='#000' />
              </TouchableOpacity>
            )}
            <View style={{ width: '30%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
              <Text text={currentPage.toString()} style={{ fontSize: 20, fontWeight: '600', color: palette.textClassicColor }} />
            </View>
            {currentPage === drafts.length ? (
              <View style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}>
                <EntypoIcon name='chevron-thin-right' size={27} color={palette.lighterGrey} />
              </View>
            ) : (
              <TouchableOpacity
                style={{ width: '35%', height: '80%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setCurrentPage(currentPage + 1);
                }}
              >
                <EntypoIcon name='chevron-thin-right' size={25} color='#000' />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ width: '75%', justifyContent: 'center' }}>
            {navigationState ? (
              <Snackbar
                visible={navigationState}
                elevation={5}
                style={{
                  backgroundColor: palette.yellow,
                  marginVertical: spacing[5],
                  marginHorizontal: spacing[4],
                  borderRadius: 40,
                  paddingHorizontal: spacing[2],
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
        </View>
      </View>
    </ErrorBoundary>
  );
});
