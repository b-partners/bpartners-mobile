import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Button, Icon, Text } from '../../components';
import { DatePickerField } from '../../components/date-picker-field/date-picker-field';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice, createInvoiceDefaultModel } from '../../models/entities/invoice/invoice';
import { Product, createProductDefaultModel } from '../../models/entities/product/product';
import { color, spacing } from '../../theme';
import { CustomerFormFieldFooter } from './components/customer-form-field-footer';
import { InvoiceFormField } from './components/invoice-form-field';
import { ProductFormField } from './components/product-form-field';
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

  const { control, handleSubmit } = useForm({
    defaultValues: createInvoiceDefaultModel().create(),
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: 'products' });

  const onSubmit = invoice => {
    __DEV__ && console.tron.log({ invoice });
  };

  return (
    <View style={{ paddingBottom: spacing[6] }}>
      <View style={ROW_STYLE}>
        <Controller
          name='title'
          control={control}
          render={({ field: { value, onBlur, onChange } }) => {
            return (
              <InvoiceFormField
                labelTx='invoiceFormScreen.invoiceForm.title'
                placeholderTx='invoiceFormScreen.invoiceForm.titlePlaceholder'
                style={{ flex: 1 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            );
          }}
        />
      </View>
      <View style={ROW_STYLE}>
        <Controller
          name='ref'
          control={control}
          render={({ field: { value, onBlur, onChange } }) => {
            return (
              <InvoiceFormField
                labelTx='invoiceFormScreen.invoiceForm.reference'
                placeholderTx='invoiceFormScreen.invoiceForm.referencePlaceholder'
                style={{ flex: 1 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            );
          }}
        />
      </View>
      <View style={ROW_STYLE}>
        <Controller
          name='sendingDate'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <DatePickerField
                labelTx='invoiceFormScreen.invoiceForm.sendingDate'
                isButtonPreset={false}
                labelStyle={DATE_PICKER_LABEL_STYLE}
                containerStyle={DATE_PICKER_CONTAINER_STYLE}
                textStyle={DATE_PICKER_TEXT_STYLE}
                dateSeparator='/'
                value={value}
                onDateChange={onChange}
              />
            );
          }}
        />
        <Controller
          name='validityDate'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <DatePickerField
                labelTx='invoiceFormScreen.invoiceForm.validityDate'
                isButtonPreset={false}
                labelStyle={DATE_PICKER_LABEL_STYLE}
                containerStyle={DATE_PICKER_CONTAINER_STYLE}
                textStyle={DATE_PICKER_TEXT_STYLE}
                dateSeparator='/'
                value={value}
                onDateChange={onChange}
              />
            );
          }}
        />
      </View>
      <View style={ROW_STYLE}>
        <Controller
          name='delayInPaymentAllowed'
          control={control}
          render={({ field: { value, onBlur, onChange } }) => {
            return (
              <InvoiceFormField
                labelTx='invoiceFormScreen.invoiceForm.delayInPaymentAllowed'
                placeholderTx='invoiceFormScreen.invoiceForm.delayInPaymentAllowedPlaceholder'
                style={{ flex: 1 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
              />
            );
          }}
        />
        <Controller
          name='delayPenaltyPercent'
          control={control}
          render={({ field: { value, onBlur, onChange } }) => {
            return (
              <InvoiceFormField
                labelTx='invoiceFormScreen.invoiceForm.delayPenaltyPercent'
                placeholderTx='invoiceFormScreen.invoiceForm.delayPenaltyPercentPlaceholder'
                style={{ flex: 1 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
              />
            );
          }}
        />
      </View>
      <View style={{ ...ROW_STYLE, marginBottom: spacing[5] }}>
        <Controller
          name='comment'
          control={control}
          render={({ field: { value, onBlur, onChange } }) => {
            return (
              <InvoiceFormField
                labelTx='invoiceFormScreen.invoiceForm.comment'
                placeholderTx='invoiceFormScreen.invoiceForm.comment'
                style={{ flex: 1 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
              />
            );
          }}
        />
      </View>
      <>
        <View style={{ paddingHorizontal: spacing[4] }}>
          {fields.map((_, i) => {
            return (
              <ProductFormField
                key={i}
                index={i}
                items={products}
                onDeleteItem={async (__, index) => {
                  await remove(index);
                }}
                onValueChange={product => {
                  update(i, product);
                }}
              />
            );
          })}
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
              paddingHorizontal: spacing[6],
              width: '100%',
              marginBottom: 0,
            }}
            onPress={async () => {
              const product = await createProductDefaultModel().create();
              await append(product);
            }}
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
        <Controller
          name='customer'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <SelectFormField
                value={value?.id}
                onValueChange={onChange}
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
            );
          }}
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
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
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
