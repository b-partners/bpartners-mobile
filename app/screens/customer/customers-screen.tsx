import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Linking, Platform, View } from 'react-native';
import RNFS from 'react-native-fs';
import { Button as IButton, Searchbar } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { BpPagination, Header, Loader, Screen, Separator, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Customer as ICustomer } from '../../models/entities/customer/customer';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { getThreshold } from '../../utils/get-threshold';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/utils/utils';
import { FULL, LOADER_STYLE, SECTION_LIST_CONTAINER_STYLE, SEPARATOR_STYLE } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { Customer } from './components/customer';
import { CustomerModal } from './components/customer-modal';

export type CustomerModalType = {
  type: string;
  state: boolean;
  customer: ICustomer;
};
export const CustomersScreen: FC<DrawerScreenProps<NavigatorParamList, 'customer'>> = observer(({ navigation }) => {
  const { customerStore } = useStores();
  const { customers, loadingCustomer } = customerStore;

  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(customers.length / itemsPerPage));
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<CustomerModalType>({
    type: 'CREATION',
    state: false,
    customer: null,
  });

  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = customers.slice(startItemIndex, endItemIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await customerStore.getCustomers();
      } catch {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    };

    fetchData();
  }, [modal]);

  const handleRefresh = async () => {
    await customerStore.getCustomers({ page: 1, pageSize: invoicePageSize });
    setMaxPage(Math.ceil(customers.length / itemsPerPage));
  };

  const handleScroll = async event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= getThreshold()) {
      try {
        await handleRefresh();
      } catch {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    }
  };

  const convertToCSV = data => {
    const dataWithoutId = data.map(item => {
      return Object.keys(item)
        .filter(key => key !== 'id')
        .reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {});
    });

    const csvHeader = Object.keys(dataWithoutId[0]).join(',') + '\n';
    const csvRows = dataWithoutId.map(item => Object.values(item).join(',')).join('\n');

    return csvHeader + csvRows;
  };

  async function saveCSVToFile(csvString) {
    const filePath = RNFS.DocumentDirectoryPath + `/customers.csv`;

    try {
      await RNFS.writeFile(filePath, csvString, 'utf8');
      Snackbar.show({
        text: `${translate('common.saved')} ${filePath}`,
        duration: 5000,
        backgroundColor: palette.green,
        action: {
          text: translate('common.open'),
          textColor: palette.white,
          onPress: () => {
            Linking.openURL(`file://${filePath}`).catch(err => {
              showMessage(err.toString(), { backgroundColor: palette.pastelRed });
            });
          },
        },
      });
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    }
  }

  const searchCustomer = async filter => {
    try {
      await customerStore.getCustomers(filter);
      setCurrentPage(1);
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    }
  };

  const debounceTimeoutRef = useRef(null);

  const handleInputChange = query => {
    setSearchQuery(query);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      await searchCustomer(query);
    }, 1000);
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='customerScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
      <View testID='CustomersScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        <Searchbar
          placeholder={translate('common.search')}
          onChangeText={handleInputChange}
          value={searchQuery}
          style={{
            backgroundColor: palette.solidGrey,
            height: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing[4],
            width: '90%',
            marginHorizontal: '5%',
          }}
          iconColor={palette.lightGrey}
          clearIcon='close-circle'
          inputStyle={{ color: palette.black, alignSelf: 'center' }}
          placeholderTextColor={palette.lightGrey}
        />
        {!loadingCustomer ? (
          <Screen
            style={{ backgroundColor: palette.white, flexDirection: 'column', paddingBottom: spacing[3] }}
            preset='scroll'
            backgroundColor={palette.white}
          >
            <View>
              <FlatList<ICustomer>
                data={displayedItems}
                style={SECTION_LIST_CONTAINER_STYLE}
                renderItem={({ item }) => <Customer item={item} setCreationModal={setModal} />}
                keyExtractor={item => item.id}
                refreshing={loadingCustomer}
                onRefresh={handleRefresh}
                progressViewOffset={100}
                ItemSeparatorComponent={() => <Separator style={SEPARATOR_STYLE} />}
                onScrollEndDrag={handleScroll}
              />
            </View>
          </Screen>
        ) : (
          <Loader size='large' containerStyle={LOADER_STYLE} />
        )}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: spacing[2],
              height: 80,
              width: '100%',
              marginBottom: spacing[4],
              alignItems: 'center',
              paddingLeft: spacing[4],
            }}
          >
            <BpPagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
            <IButton
              compact={true}
              buttonColor={palette.secondaryColor}
              textColor={palette.white}
              style={{
                width: 100,
                height: 40,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                marginLeft: spacing[6],
              }}
              onPress={() => {
                customerStore.saveCustomerInit();
                setModal({
                  type: 'CREATION',
                  state: true,
                  customer: null,
                });
              }}
            >
              <MaterialCommunityIcons name='plus' size={20} color={palette.white} />
              <Text tx={'common.create'} style={{ fontSize: 14 }} />
            </IButton>
            <IButton
              disabled={loadingCustomer}
              compact={true}
              buttonColor={palette.secondaryColor}
              textColor={palette.white}
              style={{
                width: 100,
                height: 40,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                marginLeft: spacing[4],
              }}
              onPress={() => {
                const csvString = convertToCSV(customers);
                saveCSVToFile(csvString);
              }}
            >
              <MaterialCommunityIcons name='download' size={22} color={palette.white} />
              <Text tx={'customerScreen.export'} style={{ fontSize: 14, height: '100%' }} />
            </IButton>
          </View>
        </KeyboardAvoidingView>
        <CustomerModal modal={modal} setModal={setModal} />
      </View>
    </ErrorBoundary>
  );
});
