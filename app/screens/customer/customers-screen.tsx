import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { FlatList, View } from 'react-native';

import { BpPagination, Header, Loader, Screen, Separator } from '../../components';
import { useStores } from '../../models';
import { Customer as ICustomer } from '../../models/entities/customer/customer';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { ErrorBoundary } from '../error/error-boundary';
import { itemsPerPage } from '../invoice-form/components/utils';
import { FULL, LOADER_STYLE, SECTION_LIST_CONTAINER_STYLE, SEPARATOR_STYLE } from '../invoices/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';
import { Customer } from './components/customer';

export const CustomersScreen: FC<DrawerScreenProps<NavigatorParamList, 'customer'>> = observer(({ navigation }) => {
  const { customerStore } = useStores();
  const { customers, loadingCustomer } = customerStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(customers.length / itemsPerPage));
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = customers.slice(startItemIndex, endItemIndex);

  const handleRefresh = async () => {
    await customerStore.getCustomers();
    setMaxPage(Math.ceil(customers.length / itemsPerPage));
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= -5) {
      handleRefresh();
    }
  };

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='paymentListScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
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
        <View style={{ flexDirection: 'row', marginTop: spacing[2], height: 80 }}>
          <BpPagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
        </View>
      </View>
    </ErrorBoundary>
  );
});
