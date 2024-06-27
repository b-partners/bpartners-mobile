// *import { Octicons } from '@expo/vector-icons';
import { Observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Modal, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { ProgressBar, Searchbar } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Button, Icon, Separator, Text, TextField } from '../../../../components';
import RadioButton from '../../../../components/radio-button/radio-button';
import { translate } from '../../../../i18n';
import { useStores } from '../../../../models';
import { Product } from '../../../../models/entities/product/product';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { printCurrencyToMajors, printVat } from '../../../../utils/money';
import { showMessage } from '../../../../utils/snackbar';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../../../invoices/utils/styles';
import { ProductModal } from '../../../product/components/product-modal';
import { ProductModalType } from '../../../product/products-screen';
import { invoicePageSize } from '../../utils/utils';
import { InvoiceFormField } from '../invoice/invoice-form-field';

type ProductFormFieldProps = {
  index: number;
  temp: Product;
  items: Product[];
  onDeleteItem: (product: Product, index: number) => void;
  onValueChange?: (product: Product) => void;
};

export const ProductFormField: React.FC<ProductFormFieldProps> = props => {
  const { onValueChange, onDeleteItem, items, temp, index } = props;
  const [currentProduct, setCurrentProduct] = useState<Product | null>(temp);

  const [modal, setModal] = useState<ProductModalType>({
    type: 'CREATION',
    state: false,
    product: null,
  });
  const [visible, setVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [quantityValue, setQuantityValue] = useState(temp?.quantity?.toString());
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { productStore, authStore } = useStores();
  const { height } = useWindowDimensions();
  const MAX_HEIGHT = (7 * height) / 10;

  const isSubjectToVat = authStore?.currentAccountHolder?.companyInfo?.isSubjectToVat;
  const itemsPerPage = 10;

  const startItemIndex = (currentPage - 1) * itemsPerPage;
  const endItemIndex = currentPage * itemsPerPage;
  const displayedItems = items.slice(startItemIndex, endItemIndex);

  useEffect(() => {
    onValueChange && onValueChange(currentProduct);
  }, [currentProduct]);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      setIsFetching(true);
      try {
        await productStore.getProducts();
      } catch (e) {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      } finally {
        if (!isCancelled) {
          setIsFetching(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const searchCustomer = async filter => {
    setIsFetching(true);
    try {
      await productStore.getProducts({
        descriptionFilter: filter,
        page: 1,
        pageSize: invoicePageSize,
      });
      setCurrentPage(1);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    } finally {
      setIsFetching(false);
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
    <Observer>
      {() => (
        <View
          style={{
            paddingVertical: spacing[4],
            shadowColor: color.palette.secondaryColor,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            backgroundColor: color.palette.white,
            zIndex: 10,
            borderRadius: 10,
            marginBottom: spacing[6],
          }}
        >
          <Button
            style={{
              flexDirection: 'row',
              backgroundColor: color.transparent,
              position: 'absolute',
              top: -10,
              right: -15,
            }}
            onPress={() => {
              onDeleteItem(currentProduct, index);
            }}
          >
            <Text
              tx='invoiceFormScreen.productForm.delete'
              style={{
                color: color.palette.secondaryColor,
                fontFamily: 'Geometria',
                fontSize: 13,
                marginRight: spacing[1],
              }}
            />
            <Icon icon='trash' />
          </Button>
          <View>
            <Observer>
              {() => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      productStore.saveProductInit();
                      setModal({
                        type: 'CREATION',
                        state: true,
                        product: null,
                      });
                    }}
                    style={{ flex: 1, height: 70, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <RNVIcon name='pluscircleo' size={35} color={color.palette.secondaryColor} />
                  </TouchableOpacity>
                  <View
                    style={{
                      marginRight: '2.5%',
                      paddingHorizontal: spacing[3],
                      marginVertical: spacing[4],
                      width: '80%',
                      borderWidth: 1,
                      borderColor: '#E1E5EF',
                      borderRadius: 25,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                      onPress={() => setVisible(true)}
                    >
                      <TextField
                        editable={false}
                        placeholderTx='invoiceFormScreen.productForm.placeholder'
                        value={currentProduct?.description}
                        labelStyle={{
                          fontFamily: 'Geometria-Bold',
                          fontSize: 15,
                          textTransform: 'uppercase',
                        }}
                        inputStyle={{
                          fontFamily: 'Geometria-Bold',
                          fontSize: 15,
                          textTransform: 'uppercase',
                        }}
                        style={{ width: '80%' }}
                      />
                      <View style={{ justifyContent: 'center' }}>
                        <EntypoIcon name='chevron-thin-down' size={18} color='#000' />
                      </View>
                    </TouchableOpacity>
                    <ProductModal modal={modal} setModal={setModal} isSubjectToVat={isSubjectToVat} />
                    <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={() => setVisible(false)}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          backgroundColor: 'rgba(10, 16, 69, 0.5)',
                          alignItems: 'center',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        {isFetching && (
                          <View style={{ width: '100%' }}>
                            <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true} style={{ marginTop: spacing[2] }} />
                          </View>
                        )}
                        <View
                          style={[
                            {
                              paddingHorizontal: spacing[4],
                              backgroundColor: palette.white,
                              width: '100%',
                              height: MAX_HEIGHT,
                            },
                          ]}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginVertical: spacing[1],
                              paddingTop: spacing[1],
                              paddingHorizontal: spacing[2],
                              height: '5%',
                            }}
                          >
                            <Text
                              tx={'invoiceFormScreen.productForm.placeholder'}
                              style={{
                                color: color.palette.lightGrey,
                                fontFamily: 'Geometria',
                                fontSize: 15,
                              }}
                            />
                            <TouchableOpacity onPress={() => setVisible(false)}>
                              <RNVIcon name='close' color={color.palette.lightGrey} size={14} />
                            </TouchableOpacity>
                          </View>
                          <Searchbar
                            placeholder={translate('common.search')}
                            onChangeText={handleInputChange}
                            value={searchQuery}
                            onClearIconPress={() => {}}
                            style={{
                              backgroundColor: palette.solidGrey,
                              height: 40,
                              borderRadius: 10,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            iconColor={palette.lightGrey}
                            clearIcon='close-circle'
                            inputStyle={{ color: palette.black, alignSelf: 'center' }}
                            placeholderTextColor={palette.lightGrey}
                          />
                          <View style={{ paddingVertical: spacing[2], height: '73%' }}>
                            <FlatList
                              data={displayedItems}
                              keyExtractor={item => item.id}
                              renderItem={({ item: product }) => {
                                return (
                                  <View
                                    style={{
                                      flex: 1,
                                      flexDirection: 'row',
                                      paddingVertical: spacing[2],
                                    }}
                                  >
                                    <TouchableOpacity
                                      style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                      }}
                                      onPress={() => {
                                        setQuantityValue('1');
                                        setCurrentProduct({
                                          ...product,
                                          quantity: 1,
                                        });
                                        setTotalPrice(product.unitPriceWithVat * 1);
                                      }}
                                    >
                                      <>
                                        <RadioButton isActive={product.id === currentProduct?.id} />
                                        <Text
                                          text={product.description}
                                          style={{
                                            color: palette.textClassicColor,
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                            marginLeft: spacing[2],
                                          }}
                                          numberOfLines={2}
                                        />
                                      </>
                                    </TouchableOpacity>
                                    {/*<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                          <Octicons name={'pencil'} color={palette.greyDarker} size={20} />
                                        </TouchableOpacity>*/}
                                  </View>
                                );
                              }}
                              ItemSeparatorComponent={() => <Separator style={{ borderColor: palette.lighterGrey }} />}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: spacing[2],
                              height: 80,
                            }}
                          >
                            <View
                              style={{
                                width: '25%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                height: '100%',
                                justifyContent: 'space-evenly',
                              }}
                            >
                              {currentPage === 1 ? (
                                <View
                                  style={{
                                    width: '35%',
                                    height: '80%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <EntypoIcon name='chevron-thin-left' size={27} color={palette.lighterGrey} />
                                </View>
                              ) : (
                                <TouchableOpacity
                                  style={{
                                    width: '35%',
                                    height: '80%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  onPress={() => {
                                    setCurrentPage(currentPage - 1);
                                  }}
                                >
                                  <EntypoIcon name='chevron-thin-left' size={25} color='#000' />
                                </TouchableOpacity>
                              )}
                              <View
                                style={{
                                  width: '30%',
                                  height: '80%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text
                                  text={currentPage.toString()}
                                  style={{
                                    fontSize: 20,
                                    fontWeight: '600',
                                    color: palette.textClassicColor,
                                  }}
                                />
                              </View>
                              {currentPage === items.length ? (
                                <View
                                  style={{
                                    width: '35%',
                                    height: '80%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <EntypoIcon name='chevron-thin-right' size={27} color={palette.lighterGrey} />
                                </View>
                              ) : (
                                <TouchableOpacity
                                  style={{
                                    width: '35%',
                                    height: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  onPress={() => {
                                    setCurrentPage(currentPage + 1);
                                  }}
                                >
                                  <EntypoIcon name='chevron-thin-right' size={25} color='#000' />
                                </TouchableOpacity>
                              )}
                            </View>
                            <View style={{ width: '75%', justifyContent: 'center' }}>
                              <Button
                                tx='invoiceFormScreen.customerSelectionForm.validate'
                                style={BUTTON_INVOICE_STYLE}
                                textStyle={BUTTON_TEXT_STYLE}
                                onPress={() => setVisible(false)}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </View>
              )}
            </Observer>
          </View>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <TextField
              labelTx='invoiceFormScreen.productForm.quantity'
              labelStyle={{
                fontFamily: 'Geometria-Bold',
                fontSize: 12,
                textTransform: 'uppercase',
                alignSelf: 'center',
              }}
              style={{ borderColor: '#E1E5EF', borderWidth: 1, width: '25%' }}
              inputStyle={{
                borderRadius: 5,
                fontFamily: 'Geometria-Bold',
                fontSize: 16,
                textTransform: 'uppercase',
                alignSelf: 'center',
              }}
              keyboardType='numeric'
              value={quantityValue}
              onChangeText={quantity => {
                setQuantityValue(quantity);
                setCurrentProduct(product => ({ ...product, quantity: +quantity }));
                setTotalPrice(currentProduct?.unitPriceWithVat * +quantity);
              }}
            />
            <TextField
              labelTx='invoiceFormScreen.productForm.unitPrice'
              labelStyle={{ fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase' }}
              style={{ borderColor: '#E1E5EF', borderWidth: 1, width: '50%', padding: spacing[2] }}
              inputStyle={{ fontFamily: 'Geometria-Bold', fontSize: 16, textTransform: 'uppercase' }}
              keyboardType='numeric'
              editable={false}
              value={printCurrencyToMajors(currentProduct?.unitPrice)?.toString()}
            />
            <TextField
              labelTx='invoiceFormScreen.productForm.vat'
              labelStyle={{
                fontFamily: 'Geometria-Bold',
                fontSize: 12,
                textTransform: 'uppercase',
                alignSelf: 'center',
              }}
              style={{ borderColor: '#E1E5EF', borderWidth: 1, width: '25%' }}
              inputStyle={{
                fontFamily: 'Geometria-Bold',
                fontSize: 16,
                textTransform: 'uppercase',
                alignSelf: 'center',
              }}
              keyboardType='numeric'
              editable={false}
              value={printVat(currentProduct?.vatPercent)}
            />
          </View>
          <View>
            <InvoiceFormField labelTx='invoiceFormScreen.productForm.totalWithVat' editable={false} value={printCurrencyToMajors(totalPrice)} />
          </View>
        </View>
      )}
    </Observer>
  );
};
