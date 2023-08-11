import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { SectionList, View } from 'react-native';

import { BpPagination, Loader, Screen, Separator, Text } from '../../components';
import { useStores } from '../../models';
import { Customer as ICustomer } from '../../models/entities/customer/customer';
import { TabNavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { ErrorBoundary } from '../error/error-boundary';
import { itemsPerPage } from '../invoice-form/components/utils';
import { FOOTER_COMPONENT_STYLE, FULL, LOADER_STYLE, SECTION_HEADER_TEXT_STYLE, SECTION_LIST_CONTAINER_STYLE, SEPARATOR_STYLE } from '../invoices/styles';
import { Customer } from './components/customer';

export const CustomersScreen: FC<MaterialTopTabScreenProps<TabNavigatorParamList, 'invoices'>> = observer(() => {
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
      <View testID='CustomersScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        {!loadingCustomer ? (
          <Screen
            style={{ backgroundColor: color.transparent, display: 'flex', flexDirection: 'column', paddingBottom: spacing[3] }}
            preset='scroll'
            backgroundColor={palette.white}
          >
            <View>
              <SectionList<ICustomer>
                style={SECTION_LIST_CONTAINER_STYLE}
                sections={[...displayedItems]}
                renderItem={({ item }) => <Customer item={item} />}
                keyExtractor={item => item.id}
                renderSectionHeader={({ section: { title } }) => <Text style={SECTION_HEADER_TEXT_STYLE}>{capitalizeFirstLetter(title)}</Text>}
                refreshing={loadingCustomer}
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
          <BpPagination maxPage={maxPage} page={currentPage} setPage={setCurrentPage} />
        </View>
      </View>
    </ErrorBoundary>
  );
});
