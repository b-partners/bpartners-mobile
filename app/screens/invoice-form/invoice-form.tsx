import React, { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Button, Icon, Text } from '../../components';
import { DatePickerField } from '../../components/date-picker-field/date-picker-field';
import { useStores } from '../../models';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice, InvoiceStatus, createInvoiceDefaultModel } from '../../models/entities/invoice/invoice';
import { Product, createProductDefaultModel } from '../../models/entities/product/product';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { CustomerFormFieldFooter } from './components/customer-form-field-footer';
import { CustomerCreationModal } from './components/customer-selection-form/customer-creation-modal';
import { InvoiceFormField } from './components/invoice-form-field';
import { ProductFormField } from './components/product-form-field';
import { SelectFormField } from './select-form-field/select-form-field';

type InvoiceFormProps = {
  invoice: Invoice;
  products: Product[];
  onSaveInvoice: (invoice: Invoice) => Promise<void>;
  invoiceType?: InvoiceStatus;
};

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
  const { products, invoiceType } = props;
  const { invoiceStore, customerStore } = useStores();
  const { customers } = invoiceStore;
  const FIRST_CUSTOMER = customers.length > 0 ? customers[0] : null;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(FIRST_CUSTOMER);
  const [creationModal, setCreationModal] = useState(false);

  __DEV__ && console.tron.log({ invoiceType });

  const { control, handleSubmit } = useForm({
    defaultValues: createInvoiceDefaultModel(invoiceType).create(),
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: 'products' });
  const [title, setTitle] = useState(null);
  const [comment, setComment] = useState(null);

  const onSubmit = async invoice => {
    __DEV__ && console.tron.log({ invoice });
    try {
      await invoiceStore.saveInvoice({
        ...invoice,
        customer: selectedCustomer,
        comment: comment,
        title: title,
        metadata: { ...invoice.metadata, submittedAt: new Date() },
      });
    } catch (e) {
      showMessage(e);
      throw e;
    }
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
                onChangeText={newValue => {
                  onChange();
                  setTitle(newValue);
                }}
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
          name='toPayAt'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <DatePickerField
                labelTx='invoiceFormScreen.invoiceForm.toPayAt'
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
                onChangeText={newValue => {
                  onChange();
                  setComment(newValue);
                }}
                value={value?.toString()}
              />
            );
          }}
        />
      </View>
      <>
        <View style={{ paddingHorizontal: spacing[4] }}>
          {fields.map((item, i) => {
            return (
              <ProductFormField
                key={i}
                index={i}
                items={products}
                onDeleteItem={async productItem => {
                  const itemIndex = fields.findIndex(
                    itemProduct => itemProduct.description === productItem.description && itemProduct.unitPrice === productItem.unitPrice
                  );
                  await remove(itemIndex);
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
              backgroundColor: palette.white,
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
                customers={customers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                value={value?.id}
                onValueChange={newValue => {
                  onChange();
                  setSelectedCustomer(newValue);
                }}
                labelTx='invoiceScreen.labels.customerSection'
                modalTx='invoiceFormScreen.customerSelectionForm.title'
                placeholderTx='invoiceScreen.labels.customerSectionPlaceholder'
                items={customers}
                itemLabel='name'
                itemValue='id'
                itemSuffix={<Icon icon='edit' />}
                itemSuffixAction={() => {}}
                footer={<CustomerFormFieldFooter />}
                selectContainerStyle={{
                  paddingHorizontal: spacing[3],
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
      <Button
        onPress={() => {
          customerStore.saveCustomerInit();
          setCreationModal(true);
        }}
        style={{
          flexDirection: 'row',
          marginBottom: spacing[6],
          backgroundColor: palette.white,
          borderColor: color.palette.secondaryColor,
          borderWidth: 1,
          borderRadius: 25,
          paddingVertical: spacing[2],
            marginHorizontal: spacing[2]
        }}
      >
        <RNVIcon name='plus' color={color.palette.secondaryColor} size={15} />
        <Text
          tx='invoiceFormScreen.customerSelectionForm.addClient'
          style={{
            color: color.palette.secondaryColor,
            marginLeft: spacing[2],
            fontFamily: 'Geometria',
          }}
        />
      </Button>
      <CustomerCreationModal creationModal={creationModal} setCreationModal={setCreationModal} />
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
        {/*<Button
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
        />*/}
      </View>
    </View>
  );
};
