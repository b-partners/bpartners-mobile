import { Observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import {FlatList, Modal, TouchableOpacity, View} from 'react-native';

import { Octicons as Icon } from '@expo/vector-icons';
import {Button, Separator, Text, TextField} from '../../../components';
import { Product } from '../../../models/entities/product/product';
import { color, spacing } from '../../../theme';
import { printCurrency, printVat } from '../../../utils/money';
import { InvoiceFormField } from './invoice-form-field';
import RNVIcon from 'react-native-vector-icons/AntDesign';
import {palette} from "../../../theme/palette";
import RadioButton from "../select-form-field/radio-button";
import {CustomerFormFieldFooter} from "./customer-form-field-footer";
import EntypoIcon from 'react-native-vector-icons/Entypo';

type ProductFormFieldProps = {
  index: number;
  items: Product[];
  onDeleteItem: (product: Product, index: number) => void;
  onValueChange?: (product: Product) => void;
};

export const ProductFormField: React.FC<ProductFormFieldProps> = props => {
  const { index, onValueChange, onDeleteItem, items } = props;
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    onValueChange && onValueChange(currentProduct);
  }, [currentProduct]);

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
            onPress={() => onDeleteItem(currentProduct, index)}
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
                  <View style={{marginHorizontal: '10%', paddingHorizontal: spacing[3], marginVertical: spacing[4], width: '80%', borderWidth: 1, borderColor: '#E1E5EF'}}>
                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} onPress={() => setVisible(true)}>
                      <TextField
                          editable={false}
                          value={currentProduct?.description}
                          labelStyle={{ fontFamily: 'Geometria-Bold', fontSize: 15, textTransform: 'uppercase'}}
                          inputStyle={{fontFamily: 'Geometria-Bold', fontSize: 15, textTransform: 'uppercase'}}
                      />
                      <View style={{ justifyContent: 'center' }}>
                        <EntypoIcon name='chevron-thin-down' size={18} color='#000'/>
                      </View>
                    </TouchableOpacity>
                    <Modal visible={visible} animationType='fade' transparent={true} onRequestClose={() => setVisible(false)}>
                      <View>
                        <View
                            style={{
                              backgroundColor: 'rgba(10, 16, 69, 0.5)',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                            }}
                        >
                          <View
                              style={[
                                {
                                  padding: spacing[3],
                                  backgroundColor: color.palette.white,
                                  width: '100%',
                                },
                              ]}
                          >
                            <View style={{ paddingVertical: spacing[4], paddingHorizontal: spacing[3] }}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text
                                    tx={'invoiceFormScreen.customerSelectionForm.title'}
                                    style={{
                                      color: color.palette.lightGrey,
                                      fontFamily: 'Geometria',
                                      fontSize: 13,
                                    }}
                                />
                                <TouchableOpacity onPress={() => setVisible(false)}>
                                  <RNVIcon name='close' color={color.palette.lightGrey} size={14} />
                                </TouchableOpacity>
                              </View>
                              <View style={{ paddingVertical: spacing[2] }}>
                                <FlatList
                                    data={items}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item: product }) => {
                                      return (
                                          <View style={{  flex: 1,
                                            flexDirection: 'row', paddingVertical: spacing[2] }}>
                                            <TouchableOpacity style={{  flex: 1,
                                              flexDirection: 'row', }} onPress={() => setCurrentProduct(product)}>
                                              <>
                                                <RadioButton isActive={product.id === currentProduct?.id} />
                                                <Text text={product.description} style={{ color: palette.textClassicColor,
                                                  fontWeight: 'bold',
                                                  fontSize: 18, marginLeft: spacing[2] }} numberOfLines={2} />
                                              </>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                              <Icon name={'pencil'} color={palette.greyDarker} size={20} />
                                            </TouchableOpacity>
                                          </View>
                                      );
                                    }}
                                    ItemSeparatorComponent={() => <Separator style={{ borderColor: palette.lighterGrey }} />}
                                />
                                <CustomerFormFieldFooter />
                              </View>
                              <Button
                                  tx='components.button.close'
                                  style={{
                                    backgroundColor: color.palette.secondaryColor,
                                    borderRadius: 50,
                                    paddingVertical: spacing[3],
                                    marginTop: spacing[5],
                                  }}
                                  textStyle={{ fontSize: 16, fontFamily: 'Geometria' }}
                                  onPress={() => setVisible(false)}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
              )}
            </Observer>
          </View>
          <View style={{ flexDirection: 'row', width: '100%'}}>
            <TextField
                labelTx='invoiceFormScreen.productForm.quantity'
                labelStyle={{ fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase', alignSelf: 'center'  }}
                style={{ borderColor: '#E1E5EF', borderWidth: 1, width: '25%'}}
                inputStyle={{ fontFamily: 'Geometria-Bold', fontSize: 16, textTransform: 'uppercase', alignSelf: 'center' }}
                keyboardType='numeric'
                onChangeText={quantity => {
                  setCurrentProduct(product => ({ ...product, quantity: +quantity }));
                }}
            />
            <TextField
                labelTx='invoiceFormScreen.productForm.unitPrice'
                labelStyle={{ fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase' }}
                style={{ borderColor: '#E1E5EF', borderWidth: 1, width: '50%', padding: spacing[2] }}
                inputStyle={{ fontFamily: 'Geometria-Bold', fontSize: 16, textTransform: 'uppercase' }}
                keyboardType='numeric'
                editable={false}
                value={printCurrency(currentProduct?.unitPrice)?.toString()}
            />
            <TextField
                labelTx='invoiceFormScreen.productForm.vat'
                labelStyle={{ fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase', alignSelf: 'center' }}
                style={{ borderColor: '#E1E5EF', borderWidth: 1, width: '25%' }}
                inputStyle={{ fontFamily: 'Geometria-Bold', fontSize: 16, textTransform: 'uppercase', alignSelf: 'center' }}
                keyboardType='numeric'
                editable={false}
                value={printVat(currentProduct?.vatPercent)}
            />
          </View>
          <View>
            <InvoiceFormField
              labelTx='invoiceFormScreen.productForm.totalWithVat'
              editable={false}
              value={printCurrency(currentProduct?.unitPriceWithVat * currentProduct?.quantity)}
            />
          </View>
        </View>
      )}
    </Observer>
  );
};
