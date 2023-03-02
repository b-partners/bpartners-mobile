import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Button, Icon, Text } from '../../components';
import { DatePickerField } from '../../components/date-picker-field/date-picker-field';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice } from '../../models/entities/invoice/invoice';
import { Product } from '../../models/entities/product/product';
import { color, spacing } from '../../theme';
import { CustomerFormFieldFooter } from './components/customer-form-field-footer';
import { InvoiceFormField } from './components/invoice-form-field';
import { ProductsFormField } from './components/products-form-field';
import { SelectFormField } from './select-form-field/select-form-field';

type InvoiceFormProps = { invoice: Invoice; customers: Customer[]; products: Product[]; onSaveInvoice: (invoice: Invoice) => Promise<void> };

const ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', width: '100%' };

const DATE_PICKER_LABEL_STYLE: TextStyle = { color: color.palette.greyDarker, fontFamily: 'Geometria-Bold' };

const DATE_PICKER_CONTAINER_STYLE: ViewStyle = {
  padding: spacing[4],
  backgroundColor: color.transparent,
  borderColor: '#E1E5EF',
  borderWidth: 1,
};

const DATE_PICKER_TEXT_STYLE: TextStyle = {
  color: color.palette.textClassicColor,
  marginTop: spacing[2],
  fontFamily: 'Geometria-Bold',
};

const INVOICE_LABEL_STYLE: TextStyle = {
  color: color.palette.greyDarker,
  fontFamily: 'Geometria-Bold',
  fontSize: 13,
  textTransform: 'uppercase',
};

export const InvoiceForm: React.FC<InvoiceFormProps> = props => {
  const { customers, products } = props;

  return (
    <View style={{ paddingBottom: spacing[6] }}>
      <View style={ROW_STYLE}>
        <InvoiceFormField labelTx='invoiceFormScreen.invoiceForm.title' placeholderTx='invoiceFormScreen.invoiceForm.titlePlaceholder' style={{ flex: 1 }} />
      </View>
      <View style={ROW_STYLE}>
        <InvoiceFormField
          labelTx='invoiceFormScreen.invoiceForm.reference'
          placeholderTx='invoiceFormScreen.invoiceForm.referencePlaceholder'
          style={{ flex: 1 }}
        />
      </View>
      <View style={ROW_STYLE}>
        <DatePickerField
          labelTx='invoiceFormScreen.invoiceForm.sendingDate'
          isButtonPreset={false}
          labelStyle={DATE_PICKER_LABEL_STYLE}
          containerStyle={DATE_PICKER_CONTAINER_STYLE}
          textStyle={DATE_PICKER_TEXT_STYLE}
          dateSeparator='/'
          value={new Date()}
          onDateChange={() => {}}
        />
        <DatePickerField
          labelTx='invoiceFormScreen.invoiceForm.validityDate'
          isButtonPreset={false}
          labelStyle={DATE_PICKER_LABEL_STYLE}
          containerStyle={DATE_PICKER_CONTAINER_STYLE}
          textStyle={DATE_PICKER_TEXT_STYLE}
          dateSeparator='/'
          value={new Date()}
          onDateChange={() => {}}
        />
      </View>
      <View style={ROW_STYLE}>
        <InvoiceFormField
          labelTx='invoiceFormScreen.invoiceForm.delayInPaymentAllowed'
          placeholderTx='invoiceFormScreen.invoiceForm.delayInPaymentAllowedPlaceholder'
          style={{ flex: 1 }}
        />
        <InvoiceFormField
          labelTx='invoiceFormScreen.invoiceForm.delayPenaltyPercent'
          placeholderTx='invoiceFormScreen.invoiceForm.delayPenaltyPercentPlaceholder'
          style={{ flex: 1 }}
        />
      </View>
      <View style={ROW_STYLE}>
        <InvoiceFormField labelTx='invoiceFormScreen.invoiceForm.comment' placeholderTx='invoiceFormScreen.invoiceForm.comment' style={{ flex: 1 }} />
      </View>
      <>
        <View>
          <ProductsFormField items={products} onValueChange={products => {}} onDeleteItem={(product, i) => {}} value={[]} />
        </View>
        <View style={{ ...ROW_STYLE, paddingHorizontal: spacing[3] }}>
          <Button
            style={{
              backgroundColor: color.transparent,
              borderColor: color.palette.secondaryColor,
              borderWidth: 1,
              borderRadius: 25,
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: spacing[3],
              paddingHorizontal: spacing[6],
              width: '100%',
            }}
            onPress={() => {}}
          >
            <RNVIcon name='plus' size={16} color={color.palette.secondaryColor} />
            <Text
              tx='invoiceFormScreen.productForm.addProduct'
              style={{
                color: color.palette.secondaryColor,
                fontFamily: 'Geometria',
                marginLeft: spacing[3],
              }}
            />
          </Button>
        </View>
      </>
      <View style={ROW_STYLE}>
        <SelectFormField
          value={''}
          onValueChange={customer => {}}
          labelTx='invoiceScreen.labels.customerSection'
          modalTx='invoiceFormScreen.customerForm.title'
          placeholderTx='invoiceScreen.labels.customerSectionPlaceholder'
          items={customers}
          itemLabel='name'
          itemValue='id'
          itemSuffix={<Icon icon='edit' />}
          itemSuffixAction={() => {}}
          footer={<CustomerFormFieldFooter />}
          selectContainerStyle={{
            padding: spacing[3],
            marginVertical: spacing[6],
            width: '100%',
            borderWidth: 1,
            borderColor: '#E1E5EF',
          }}
          style={INVOICE_LABEL_STYLE}
        />
      </View>
      <View
        style={{
          ...ROW_STYLE,
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal: spacing[5],
        }}
      >
        <TouchableOpacity onPress={() => {}}>
          <View
            style={{
              borderColor: color.palette.secondaryColor,
              borderWidth: 2,
              borderRadius: 100,
              padding: spacing[3],
            }}
          >
            <RNVIcon name='save' size={25} color={color.palette.secondaryColor} />
          </View>
        </TouchableOpacity>
        <Button
          tx='invoiceFormScreen.invoicePreview'
          style={{
            backgroundColor: color.palette.secondaryColor,
            borderRadius: 25,
            marginLeft: 15,
            flex: 1,
          }}
          textStyle={{
            color: color.palette.white,
            fontSize: 14,
            fontFamily: 'Geometria-Bold',
          }}
        />
      </View>
    </View>
  );
};
