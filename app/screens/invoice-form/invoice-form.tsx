import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import RNVIcon from 'react-native-vector-icons/AntDesign';

import { Button, Icon, Separator, Text } from '../../components';
import { DatePickerField } from '../../components/date-picker-field/date-picker-field';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice } from '../../models/entities/invoice/invoice';
import { Product } from '../../models/entities/product/product';
import { color, spacing } from '../../theme';
import { InvoiceFormField } from './invoice-form-field';
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

const SEPARATOR_STYLE = { flex: 1, borderColor: '#E1E5EF' };
export const InvoiceForm: React.FC<InvoiceFormProps> = props => {
  const { customers } = props;

  return (
    <View>
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
          value={new Date()}
          onDateChange={() => {}}
          dateSeparator='/'
        />
        <DatePickerField
          labelTx='invoiceFormScreen.invoiceForm.validityDate'
          isButtonPreset={false}
          labelStyle={DATE_PICKER_LABEL_STYLE}
          containerStyle={DATE_PICKER_CONTAINER_STYLE}
          textStyle={DATE_PICKER_TEXT_STYLE}
          value={new Date()}
          onDateChange={() => {}}
          dateSeparator='/'
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
      <View style={ROW_STYLE}>
        <SelectFormField
          labelTx='invoiceScreen.labels.customerSection'
          modalTx='invoiceFormScreen.customerForm.title'
          placeholderTx='invoiceScreen.labels.customerSectionPlaceholder'
          value={null}
          items={customers}
          itemLabel='name'
          itemValue='id'
          itemSuffix={<Icon icon='edit' />}
          itemSuffixAction={customer => {
            __DEV__ && console.tron.log({ customer });
          }}
          footer={
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing[3] }}>
              <Separator style={SEPARATOR_STYLE} />
              <Button
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  marginHorizontal: spacing[3],
                  backgroundColor: color.transparent,
                  borderColor: color.palette.secondaryColor,
                  borderWidth: 1,
                  borderRadius: 25,
                  paddingVertical: spacing[3],
                }}
              >
                <RNVIcon name='plus' color={color.palette.secondaryColor} size={15} />
                <Text
                  tx='invoiceFormScreen.customerForm.addClient'
                  style={{
                    color: color.palette.secondaryColor,
                    marginLeft: spacing[2],
                    fontFamily: 'Geometria',
                  }}
                />
              </Button>
              <Separator style={SEPARATOR_STYLE} />
            </View>
          }
          selectContainerStyle={{ padding: spacing[3], width: '100%' }}
          style={INVOICE_LABEL_STYLE}
        />
      </View>
    </View>
  );
};
