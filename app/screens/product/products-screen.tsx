import { DrawerScreenProps } from '@react-navigation/drawer';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, KeyboardAvoidingView, Linking, Platform, View } from 'react-native';
import RNFS from 'react-native-fs';
import { Button as IButton, Searchbar, TextInput } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { BpPagination, Header, Loader, Screen, Separator, Text } from '../../components';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Product as IProduct } from '../../models/entities/product/product';
import { NavigatorParamList } from '../../navigators/utils/utils';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { commaToDot } from '../../utils/comma-to-dot';
import { getThreshold } from '../../utils/get-threshold';
import { vatToMinors } from '../../utils/money';
import { showMessage } from '../../utils/snackbar';
import { ErrorBoundary } from '../error/error-boundary';
import { invoicePageSize, itemsPerPage } from '../invoice-form/utils/utils';
import { FULL, LOADER_STYLE, SECTION_LIST_CONTAINER_STYLE, SEPARATOR_STYLE } from '../invoices/utils/styles';
import { HEADER, HEADER_TITLE } from '../payment-initiation/utils/style';
import { Product } from './components/product';
import { ProductModal } from './components/product-modal';

export type ProductModalType = {
  type: string;
  state: boolean;
  product: IProduct;
};
export const ProductScreen: FC<DrawerScreenProps<NavigatorParamList, 'customer'>> = observer(({ navigation }) => {
  const { productStore, authStore } = useStores();
  const { products, loadingProduct } = productStore;

  const isSubjectToVat = authStore?.currentAccountHolder?.companyInfo?.isSubjectToVat;

  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Math.ceil(products.length / itemsPerPage));
  const [modal, setModal] = useState<ProductModalType>({
    type: 'CREATION',
    state: false,
    product: null,
  });
  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = products.slice(startItemIndex, endItemIndex);
  const [searchDescription, setSearchDescription] = useState<string>(null);
  const updateMaxPage = () => setMaxPage(Math.ceil(products.length / itemsPerPage));

  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: { price: null },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await productStore.getProducts();
      } catch (error) {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    };

    fetchData();
  }, [modal]);

  const handleRefresh = async () => {
    await productStore.getProducts({ page: 1, pageSize: invoicePageSize });
    updateMaxPage();
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

  const convertToCSV = data => {
    const dataWithoutIdQuantityCreatedAt = data.map(item => {
      return Object.keys(item)
        .filter(key => key !== 'id' && key !== 'quantity' && key !== 'createdAt')
        .reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {});
    });

    const csvHeader = Object.keys(dataWithoutIdQuantityCreatedAt[0]).join(',') + '\n';
    const csvRows = dataWithoutIdQuantityCreatedAt.map(item => Object.values(item).join(',')).join('\n');

    return csvHeader + csvRows;
  };

  async function saveCSVToFile(csvString) {
    const filePath = RNFS.DocumentDirectoryPath + `/products.csv`;

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
    } catch (error) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    }
  }

  const searchProduct = async (description: string) => {
    setCurrentPage(1);
    const searchPrice = watch('price');
    searchPrice
      ? await productStore.getProducts({
          descriptionFilter: description,
          priceFilter: vatToMinors(commaToDot(searchPrice.toString())),
          page: 1,
          pageSize: invoicePageSize,
        })
      : await productStore.getProducts({
          descriptionFilter: description,
          page: 1,
          pageSize: invoicePageSize,
        });
  };

  const handleSearchPrice = async price => {
    searchDescription
      ? await productStore.getProducts({
          descriptionFilter: searchDescription,
          priceFilter: vatToMinors(commaToDot(price)),
          page: 1,
          pageSize: invoicePageSize,
        })
      : await productStore.getProducts({
          priceFilter: vatToMinors(commaToDot(price)),
          page: 1,
          pageSize: invoicePageSize,
        });
  };

  const descriptionTimeout = useRef(null);
  const priceTimeout = useRef(null);

  const handleInputChange = query => {
    setSearchDescription(query);
    if (descriptionTimeout.current) {
      clearTimeout(descriptionTimeout.current);
    }

    descriptionTimeout.current = setTimeout(async () => {
      await searchProduct(query);
      updateMaxPage();
    }, 1000);
  };

  useEffect(() => {
    const searchPrice = watch('price');
    if (priceTimeout.current) {
      clearTimeout(priceTimeout.current);
    }

    priceTimeout.current = setTimeout(async () => {
      if (searchPrice) {
        await handleSearchPrice(searchPrice);
        updateMaxPage();
      } else {
        if (searchDescription) {
          await productStore.getProducts({
            descriptionFilter: searchDescription,
            page: 1,
            pageSize: invoicePageSize,
          });
          updateMaxPage();
        } else {
          await handleRefresh();
        }
      }
    }, 1000);
  }, [watch('price')]);

  return (
    <ErrorBoundary catchErrors='always'>
      <Header headerTx='productScreen.title' onLeftPress={() => navigation.navigate('home')} leftIcon='back' style={HEADER} titleStyle={HEADER_TITLE} />
      <View testID='ProductsScreen' style={{ ...FULL, backgroundColor: color.palette.white }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Searchbar
            placeholder={translate('common.search')}
            onChangeText={handleInputChange}
            value={searchDescription}
            style={{
              backgroundColor: palette.solidGrey,
              height: 40,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              width: '60%',
              marginHorizontal: '5%',
            }}
            iconColor={palette.lightGrey}
            clearIcon='close-circle'
            inputStyle={{ color: palette.black, alignSelf: 'center' }}
            placeholderTextColor={palette.lightGrey}
            onClearIconPress={async () => {
              const searchPrice = watch('price');
              if (searchPrice) {
                await productStore.getProducts({
                  priceFilter: vatToMinors(commaToDot(searchPrice)),
                  page: 1,
                  pageSize: invoicePageSize,
                });
                updateMaxPage();
              } else {
                await handleRefresh();
              }
            }}
          />
          <View style={{ height: 45, width: '24%', marginHorizontal: '3%' }}>
            <Controller
              control={control}
              name='price'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  keyboardType={'numeric'}
                  placeholder={translate('productScreen.price')}
                  placeholderTextColor={palette.secondaryColor}
                  autoCapitalize='none'
                  textColor={palette.secondaryColor}
                  selectionColor={palette.black}
                  value={value}
                  onChangeText={onChange}
                  style={{
                    backgroundColor: palette.white,
                    borderRadius: 5,
                    width: '100%',
                    height: 45,
                    borderColor: palette.solidGrey,
                    borderWidth: 2,
                  }}
                  theme={{
                    colors: {
                      primary: palette.secondaryColor,
                    },
                  }}
                />
              )}
            />
          </View>
        </View>
        {!loadingProduct ? (
          <Screen
            style={{
              backgroundColor: color.transparent,
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: spacing[3],
            }}
            preset='scroll'
            backgroundColor={palette.white}
          >
            <View>
              <View
                style={{
                  backgroundColor: palette.secondaryColor,
                  width: '100%',
                  paddingHorizontal: spacing[2],
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 48,
                }}
              >
                <Text
                  tx={'productScreen.description'}
                  style={{
                    color: palette.white,
                    paddingLeft: spacing[3],
                    width: '40%',
                    fontSize: 14,
                  }}
                />
                <View
                  style={{
                    width: '40%',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  {isSubjectToVat && (
                    <>
                      <Text
                        tx={'productScreen.unitPriceExclTax'}
                        style={{
                          color: palette.white,
                          width: '50%',
                          fontSize: 14,
                        }}
                      />
                      <Text
                        tx={'productScreen.tva'}
                        style={{
                          color: palette.white,
                          width: '50%',
                          fontSize: 14,
                          paddingLeft: spacing[4],
                        }}
                      />
                    </>
                  )}
                </View>
                <Text
                  tx={'productScreen.unitPriceInclTax'}
                  style={{
                    color: palette.white,
                    width: '20%',
                    fontSize: 14,
                  }}
                />
              </View>
              <FlatList<IProduct>
                data={displayedItems}
                style={SECTION_LIST_CONTAINER_STYLE}
                renderItem={({ item }) => <Product item={item} setModal={setModal} isSubjectToVat={isSubjectToVat} />}
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
                productStore.saveProductInit();
                setModal({
                  type: 'CREATION',
                  state: true,
                  product: null,
                });
              }}
            >
              <MaterialCommunityIcons name='plus' size={20} color={palette.white} />
              <Text tx={'common.create'} style={{ fontSize: 14 }} />
            </IButton>
            <IButton
              disabled={loadingProduct}
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
        </KeyboardAvoidingView>
        <ProductModal modal={modal} setModal={setModal} isSubjectToVat={isSubjectToVat} />
      </View>
    </ErrorBoundary>
  );
});
