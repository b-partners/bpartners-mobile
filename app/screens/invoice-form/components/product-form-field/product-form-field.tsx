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
import { useQueryProducts } from '../../../../queries/use-query-products';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { printCurrencyToMajors, printVat } from '../../../../utils/money';
import { BUTTON_INVOICE_STYLE, BUTTON_TEXT_STYLE } from '../../../invoices/utils/styles';
import { ProductModal } from '../../../product/components/product-modal';
import { ProductModalType } from '../../../product/products-screen';
import { InvoiceFormField } from '../invoice/invoice-form-field';
import { ProductFormFieldStyle as style } from './style';

type ProductFormFieldProps = {
  index: number;
  temp: Product;
  onDeleteItem: (product: Product, index: number) => void;
  onValueChange?: (product: Product) => void;
};

const SeparatorComponent = () => <Separator style={style.modalProductListSeparator} />;

export const ProductFormField: React.FC<ProductFormFieldProps> = props => {
  const { onValueChange, onDeleteItem, temp, index } = props;
  const [currentProduct, setCurrentProduct] = useState<Product | null>(temp);

  const [modal, setModal] = useState<ProductModalType>({
    type: 'CREATION',
    state: false,
    product: null,
  });

  const { data: products, isLoading, setFilters, page: currentPage, setPage: setCurrentPage } = useQueryProducts();

  const [visible, setVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(currentProduct.unitPriceWithVat * currentProduct.quantity);
  const [searchQuery, setSearchQuery] = useState('');

  const { productStore, authStore } = useStores();
  const { height } = useWindowDimensions();
  const MAX_HEIGHT = (7 * height) / 10;

  const isSubjectToVat = authStore?.currentAccountHolder?.companyInfo?.isSubjectToVat;

  useEffect(() => {
    onValueChange?.({ ...currentProduct, totalPriceWithVat: currentProduct.unitPrice });
  }, [currentProduct]);

  const searchCustomer = async (descriptionFilter: string) => {
    setFilters({ descriptionFilter });
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
    <View style={style.container}>
      <Button
        style={style.deleteButton}
        onPress={() => {
          onDeleteItem(currentProduct, index);
        }}
      >
        <Text tx='invoiceFormScreen.productForm.delete' style={style.deleteButtonText} />
        <Icon icon='trash' />
      </Button>
      <View>
        <View style={style.addButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              productStore.saveProductInit();
              setModal({ type: 'CREATION', state: true, product: null });
            }}
            style={style.addButtonTouch}
          >
            <RNVIcon name='pluscircleo' size={35} color={color.palette.secondaryColor} />
          </TouchableOpacity>
          <View style={style.selectProductContainer}>
            <TouchableOpacity style={style.modalCloseButtonTouch} onPress={() => setVisible(true)}>
              <TextField
                editable={false}
                placeholderTx='invoiceFormScreen.productForm.placeholder'
                value={currentProduct?.description}
                labelStyle={style.selectProductTouchLabel}
                inputStyle={style.selectProductTouchInput}
                style={{ width: '80%' }}
              />
              <View style={style.selectProductTouchIcon}>
                <EntypoIcon name='chevron-thin-down' size={18} color='#000' />
              </View>
            </TouchableOpacity>
            <ProductModal modal={modal} setModal={setModal} isSubjectToVat={isSubjectToVat} />
            <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={() => setVisible(false)}>
              <View style={style.modalContainer}>
                {isLoading && (
                  <View style={{ width: '100%' }}>
                    <ProgressBar progress={0.5} color={palette.secondaryColor} indeterminate={true} style={style.modalProgressBar} />
                  </View>
                )}
                <View style={[style.modalContent, { height: MAX_HEIGHT }]}>
                  <View style={style.modalCloseButtonContainer}>
                    <Text tx='invoiceFormScreen.productForm.placeholder' style={style.modalCloseButtonText} />
                    <TouchableOpacity onPress={() => setVisible(false)}>
                      <RNVIcon name='close' color={color.palette.lightGrey} size={14} />
                    </TouchableOpacity>
                  </View>
                  <Searchbar
                    placeholder={translate('common.search')}
                    onChangeText={handleInputChange}
                    value={searchQuery}
                    onClearIconPress={() => {}}
                    style={style.modalSearchBar}
                    iconColor={palette.lightGrey}
                    clearIcon='close-circle'
                    inputStyle={style.menuSearchBarInput}
                    placeholderTextColor={palette.lightGrey}
                  />
                  <View style={style.modalProductListContainer}>
                    <FlatList
                      data={products}
                      keyExtractor={item => item.id}
                      renderItem={({ item: product }) => {
                        return (
                          <View style={style.modalProductListItemContainer}>
                            <TouchableOpacity
                              style={style.modalProductListItemTouch}
                              onPress={() => {
                                setTotalPrice(product.unitPriceWithVat);
                                setCurrentProduct({ ...product, quantity: 1 });
                              }}
                            >
                              <RadioButton isActive={product.id === currentProduct?.id} />
                              <Text text={product.description} style={style.modalProductListItemText} numberOfLines={2} />
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                      ItemSeparatorComponent={SeparatorComponent}
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
                      {currentPage === products.length ? (
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
          value={(currentProduct.quantity || 0).toString()}
          onChangeText={quantity => {
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
  );
};
