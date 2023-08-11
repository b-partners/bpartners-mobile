import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, Platform, View } from 'react-native';
import RNFS from 'react-native-fs';
import { Button as IButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { BpPagination, Header, Loader, Screen, Separator, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Product as IProduct } from '../../models/entities/product/product';
import { NavigatorParamList } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize, itemsPerPage } from '../invoice-form/components/utils';
import { FULL, LOADER_STYLE, SECTION_LIST_CONTAINER_STYLE, SEPARATOR_STYLE } from '../invoices/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/style';
import { Log } from '../welcome/utils/utils';
import { Product } from './components/product';
import { ProductCreationModal } from './components/product-creation-modal';

export const ProductScreen: FC<DrawerScreenProps<NavigatorParamList, 'customer'>> = observer(({ navigation }) => {
  const { productStore } = useStores();
  const { products, loadingProduct } = productStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(products.length / itemsPerPage));
  const [creationModal, setCreationModal] = useState(false);
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = products.slice(startItemIndex, endItemIndex);

  useEffect(() => {
    (async () => {
      try {
        await handleRefresh();
      } catch (error) {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    })();
  }, []);

  const handleRefresh = async () => {
    await productStore.getProducts({ page: 1, pageSize: invoicePageSize });
    setMaxPage(Math.ceil(products.length / itemsPerPage));
  };

  const handleScroll = async event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= getThreshold()) {
      try {
        await handleRefresh();
      } catch (error) {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    }
  };

  const getThreshold = () => {
    return Platform.OS === 'ios' ? -10 : 0;
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
    const filePath = RNFS.DocumentDirectoryPath + `/products.csv`;

    try {
      await RNFS.writeFile(filePath, csvString, 'utf8');
      showMessage(`${translate('common.saved')} ${filePath}`, { backgroundColor: palette.green });
      Log(filePath);
    } catch (error) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    }
  }

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='customerScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
      <View testID='CustomersScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        {!loadingProduct ? (
          <Screen
            style={{ backgroundColor: color.transparent, display: 'flex', flexDirection: 'column', paddingBottom: spacing[3] }}
            preset='scroll'
            backgroundColor={palette.white}
          >
            <View>
              <FlatList<IProduct>
                data={displayedItems}
                style={SECTION_LIST_CONTAINER_STYLE}
                renderItem={({ item }) => <Product item={item} />}
                keyExtractor={item => item.id}
                refreshing={loadingProduct}
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
            onPress={() => {
              const csvString = convertToCSV(products);
              saveCSVToFile(csvString);
            }}
          >
            <MaterialCommunityIcons name='download' size={22} color={palette.white} />
            <Text tx={'customerScreen.export'} style={{ fontSize: 14 }} />
          </IButton>
        </View>
        <ProductCreationModal visibleModal={creationModal} setVisibleModal={setCreationModal} />
      </View>
    </ErrorBoundary>
  );
});
