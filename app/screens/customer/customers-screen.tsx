import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { FlatList, Platform, View } from 'react-native';
import { Button as IButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { BpPagination, Header, Loader, Screen, Separator } from '../../components';
import { Text } from '../../components';
import { useStores } from '../../models';
import { Customer as ICustomer } from '../../models/entities/customer/customer';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize } from '../invoice-form/components/utils';
import { FULL, LOADER_STYLE, SECTION_LIST_CONTAINER_STYLE, SEPARATOR_STYLE } from '../invoices/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';
import { Customer } from './components/customer';
import { CustomerCreationModal } from './components/customer-creation-modal';

export const CustomersScreen: FC<DrawerScreenProps<NavigatorParamList, 'customer'>> = observer(({ navigation }) => {
  const { customerStore } = useStores();
  const { customers, loadingCustomer } = customerStore;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [maxPage, setMaxPage] = useState(Math.ceil(customers.length / itemsPerPage));
  const [creationModal, setCreationModal] = useState(false);
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = customers.slice(startItemIndex, endItemIndex);

  const handleRefresh = async () => {
    await customerStore.getCustomers({ page: 1, pageSize: invoicePageSize });
    setMaxPage(Math.ceil(customers.length / itemsPerPage));
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= getThreshold()) {
      handleRefresh();
    }
  };

  const getThreshold = () => {
    return Platform.OS === 'ios' ? -10 : 0;
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='customerScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
      <View testID='CustomersScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        {!loadingCustomer ? (
          <Screen
            style={{ backgroundColor: color.transparent, display: 'flex', flexDirection: 'column', paddingBottom: spacing[3] }}
            preset='scroll'
            backgroundColor={palette.white}
          >
            <View>
              <FlatList<ICustomer>
                data={displayedItems}
                style={SECTION_LIST_CONTAINER_STYLE}
                renderItem={({ item }) => <Customer item={item} />}
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
            onPress={() => setCreationModal(true)}
          >
            <MaterialCommunityIcons name='plus' size={20} color={palette.white} />
            <Text tx={'common.create'} style={{ fontSize: 14 }} />
          </IButton>
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
              marginLeft: spacing[4],
            }}
          >
            <MaterialCommunityIcons name='download' size={22} color={palette.white} />
            <Text tx={'customerScreen.export'} style={{ fontSize: 14 }} />
          </IButton>
        </View>
        <CustomerCreationModal visibleModal={creationModal} setVisibleModal={setCreationModal} />
      </View>
    </ErrorBoundary>
  );
});
