import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Checkbox, List } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

import { Button, Icon, Loader, Text } from '../../components';
import { DatePickerField } from '../../components/date-picker-field/date-picker-field';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice, InvoiceStatus, createInvoiceDefaultModel } from '../../models/entities/invoice/invoice';
import { Product, createProductDefaultModel } from '../../models/entities/product/product';
import { TabNavigatorParamList, navigate } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { LOADER_STYLE } from '../invoice-quotation/styles';
import { CustomerCreationModal } from './components/customer/customer-creation-modal';
import { CustomerFormFieldFooter } from './components/customer/customer-form-field-footer';
import { PaymentCreationModal } from './components/payment-regulation-form-field/payment-creation-modal';
import { PaymentRegulationFormField } from './components/payment-regulation-form-field/payment-regulation-form-field';
import { ProductFormField } from './components/product-form-field/product-form-field';
import { SelectFormField } from './components/select-form-field/select-form-field';
import { DATE_PICKER_CONTAINER_STYLE, DATE_PICKER_LABEL_STYLE, DATE_PICKER_TEXT_STYLE, invoicePageSize } from './components/utils';
import { InvoiceCreationModal } from './invoice-creation-modal';
import { InvoiceFormField } from './invoice-form-field';

type InvoiceFormProps = {
  invoice?: Invoice;
  products: Product[];
  onSaveInvoice: (invoice: Invoice) => Promise<void>;
  status?: InvoiceStatus;
  navigation: StackNavigationProp<TabNavigatorParamList, 'invoiceForm', undefined>;
};

const ROW_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', width: '100%' };

const INVOICE_LABEL_STYLE: TextStyle = {
  color: color.palette.greyDarker,
  fontFamily: 'Geometria-Bold',
  fontSize: 13,
  textTransform: 'uppercase',
};

export enum CheckboxEnum {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
}

export const InvoiceForm: React.FC<InvoiceFormProps> = props => {
  const { products, invoice, status, navigation } = props;
  const { invoiceStore, customerStore, draftStore, quotationStore } = useStores();
  const { checkInvoice } = invoiceStore;
  const { customers } = customerStore;
  const FIRST_CUSTOMER = customers.length > 0 ? customers[0] : null;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(FIRST_CUSTOMER);
  const [creationModal, setCreationModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [paymentCreation, setPaymentCreation] = useState(false);
  const [invoiceType, setInvoiceType] = useState(InvoiceStatus.DRAFT);
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: createInvoiceDefaultModel(invoiceType, invoice).create(),
  });

  const { fields, append, remove, update, move } = useFieldArray({
    control,
    name: 'products',
    rules: {
      required: translate('errors.required'),
    },
  });
  const {
    fields: paymentFields,
    remove: paymentRemove,
    move: paymentMove,
    append: paymentAppend,
    // update: paymentUpdate,
  } = useFieldArray({ control, name: 'paymentRegulations' });
  const hasError = errors.title || errors.ref || errors.products || errors.customer;

  const [isMoveCalled, setIsMoveCalled] = useState(false);
  const [removeProduct, setRemoveProduct] = useState(false);
  const [allowPaymentDelay, setAllowPaymentDelay] = useState<CheckboxEnum>(CheckboxEnum.UNCHECKED);
  const [payInInstalments, setPayInInstalments] = useState<CheckboxEnum>(CheckboxEnum.UNCHECKED);
  const [isPaymentMoveCalled, setIsPaymentMoveCalled] = useState(false);
  const [removePaymentRegulation, setRemovePaymentRegulation] = useState(false);

  const navigateToTab = (tab: string) => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'paymentList', params: { initialRoute: tab } }],
    });
  };

  useEffect(() => {
    const removeField = async () => {
      await remove(fields.length - 1);
    };

    removeField().then(error => __DEV__ && console.tron.log(error));
    setRemoveProduct(false);
  }, [isMoveCalled]);

  useEffect(() => {
    const removeField = async () => {
      await paymentRemove(fields.length - 1);
    };

    removeField().then(error => __DEV__ && console.tron.log(error));
    setRemovePaymentRegulation(false);
  }, [isPaymentMoveCalled]);

  useEffect(() => {
    reset();
    paymentFields.length > 1 && setPayInInstalments(CheckboxEnum.CHECKED);
    const days = watch('delayInPaymentAllowed');
    const percent = watch('delayPenaltyPercent');
    if (days || percent) {
      setAllowPaymentDelay(CheckboxEnum.CHECKED);
    }
  }, []);

  const togglePaymentDelay = () => {
    if (allowPaymentDelay === CheckboxEnum.CHECKED) {
      reset({
        delayInPaymentAllowed: null,
        delayPenaltyPercent: null,
      });
      setAllowPaymentDelay(CheckboxEnum.UNCHECKED);
    } else {
      setAllowPaymentDelay(CheckboxEnum.CHECKED);
    }
  };

  const togglePaymentRegulation = () => {
    if (payInInstalments === CheckboxEnum.CHECKED) {
      paymentFields.length = 0;
      setPayInInstalments(CheckboxEnum.UNCHECKED);
    } else {
      setPayInInstalments(CheckboxEnum.CHECKED);
    }
  };

  const onSubmit = async invoices => {
    try {
      await invoiceStore.saveInvoice({
        ...invoices,
        customer: selectedCustomer,
        metadata: { ...invoices.metadata, submittedAt: new Date() },
        status: invoiceType,
      });
      setConfirmationModal(false);
      if (invoiceType === InvoiceStatus.DRAFT) {
        navigateToTab('drafts');
        await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: invoicePageSize });
        await quotationStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: invoicePageSize });
      }
      if (invoiceType === InvoiceStatus.PROPOSAL) {
        navigateToTab('quotations');
        await quotationStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: invoicePageSize });
        await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: invoicePageSize });
      }
      if (invoiceType === InvoiceStatus.CONFIRMED) {
        navigateToTab('invoices');
        await invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: invoicePageSize });
      }
    } catch (e) {
      showMessage(e);
      throw e;
    } finally {
      reset();
    }
  };

  const handleInvoicePreviewPress = async invoices => {
    // TODO(UI): error handling
    setIsLoading(true);
    try {
      const savedInvoice = await invoiceStore.saveInvoice({
        ...invoices,
        customer: selectedCustomer,
        metadata: { ...invoices.metadata, submittedAt: new Date() },
      });
      setConfirmationModal(false);

      navigate('invoicePreview', {
        fileId: savedInvoice.fileId,
        invoiceTitle: savedInvoice.title,
        invoice: savedInvoice,
        situation: true,
      });
      invoiceType === 'DRAFT' && (await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: invoicePageSize }));
      invoiceType === 'PROPOSAL' &&
        (await quotationStore.getQuotations({
          status: InvoiceStatus.PROPOSAL,
          page: 1,
          pageSize: invoicePageSize,
        }));
    } catch (e) {
      __DEV__ && console.tron.error(e.message, e.stacktrace);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ paddingBottom: spacing[6] }}>
      <View style={ROW_STYLE}>
        <Controller
          name='title'
          control={control}
          rules={{
            required: translate('errors.required'),
          }}
          render={({ field: { value, onBlur, onChange } }) => {
            return (
              <InvoiceFormField
                labelTx='invoiceFormScreen.invoiceForm.title'
                placeholderTx='invoiceFormScreen.invoiceForm.titlePlaceholder'
                style={{ flex: 1 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.title}
              />
            );
          }}
        />
      </View>
      <View style={ROW_STYLE}>
        <Controller
          name='ref'
          control={control}
          rules={{
            required: translate('errors.required'),
          }}
          render={({ field: { value, onBlur, onChange } }) => {
            return (
              <InvoiceFormField
                labelTx='invoiceFormScreen.invoiceForm.reference'
                placeholderTx='invoiceFormScreen.invoiceForm.referencePlaceholder'
                style={{ flex: 1 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.ref}
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
      {/*<View style={ROW_STYLE}>
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
      </View>*/}
      <View style={{ display: 'flex', width: '100%', height: 50, flexDirection: 'row' }}>
        <Checkbox.Item
          status={allowPaymentDelay}
          onPress={togglePaymentDelay}
          color={palette.secondaryColor}
          style={{ width: '10%' }}
          mode={'android'}
          label={''}
        />
        <Text
          tx={'invoiceFormScreen.invoiceForm.delayPaymentLabel'}
          style={{
            borderRadius: 5,
            fontFamily: 'Geometria',
            fontSize: 13,
            alignSelf: 'center',
            color: palette.darkBlack,
            width: '80%',
          }}
          numberOfLines={2}
        />
      </View>
      {allowPaymentDelay === CheckboxEnum.CHECKED && (
        <View style={ROW_STYLE}>
          <Controller
            name='delayInPaymentAllowed'
            control={control}
            render={({ field: { value, onBlur, onChange } }) => {
              let suffix: string;
              value > 1 ? (suffix = 'Jours') : (suffix = 'Jour');
              return (
                <InvoiceFormField
                  labelTx='invoiceFormScreen.invoiceForm.delayInPaymentAllowed'
                  placeholderTx='invoiceFormScreen.invoiceForm.delayInPaymentAllowedPlaceholder'
                  style={{ flex: 1 }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString()}
                  suffix={suffix}
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
                  suffix='%'
                />
              );
            }}
          />
        </View>
      )}
      <View style={ROW_STYLE}>
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
                value={value}
              />
            );
          }}
        />
      </View>
      <View style={ROW_STYLE}>
        <Controller
          name='customer'
          control={control}
          rules={{
            required: translate('errors.required'),
          }}
          render={({ field: { value, onChange } }) => {
            return (
              // @ts-ignore
              <SelectFormField
                customers={customers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                value={value}
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
                  marginBottom: spacing[6],
                  width: '100%',
                  borderWidth: 1,
                  borderColor: errors.customer ? palette.pastelRed : '#E1E5EF',
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
          marginHorizontal: spacing[2],
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
      <CustomerCreationModal visibleModal={creationModal} setVisibleModal={setCreationModal} />
      <List.Accordion
        title='Produits'
        style={{ borderColor: errors.products ? palette.pastelRed : '#E1E5EF', borderWidth: 1, height: 70, justifyContent: 'center' }}
        titleStyle={{
          fontFamily: 'Geometria-Bold',
          fontSize: 12,
          textTransform: 'uppercase',
          color: errors.products ? palette.pastelRed : palette.lighterGrey,
        }}
      >
        <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[5] }}>
          {removeProduct ? (
            <Loader size='large' containerStyle={LOADER_STYLE} />
          ) : (
            fields.map((item, i) => {
              return (
                <ProductFormField
                  key={i}
                  index={i}
                  // @ts-ignore
                  // @ts-ignore
                  temp={item}
                  items={products}
                  onDeleteItem={async (__, index) => {
                    setRemoveProduct(true);
                    await move(index, fields.length - 1);
                    setIsMoveCalled(!isMoveCalled);
                  }}
                  onValueChange={product => {
                    update(i, product);
                  }}
                />
              );
            })
          )}
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
              marginBottom: spacing[5],
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
      </List.Accordion>
      <View style={{ display: 'flex', width: '100%', height: 50, flexDirection: 'row' }}>
        <Checkbox.Item
          status={payInInstalments}
          onPress={togglePaymentRegulation}
          color={palette.secondaryColor}
          style={{ width: '10%' }}
          mode={'android'}
          label={''}
        />
        <Text
          tx={'invoiceFormScreen.paymentRegulationForm.payIn'}
          style={{
            borderRadius: 5,
            fontFamily: 'Geometria',
            fontSize: 13,
            alignSelf: 'center',
            color: palette.darkBlack,
            width: '80%',
          }}
          numberOfLines={2}
        />
      </View>
      {payInInstalments === CheckboxEnum.CHECKED && (
        <List.Accordion
          title='Accompte'
          style={{
            borderColor: '#E1E5EF',
            borderWidth: 1,
            height: 70,
            justifyContent: 'center',
            backgroundColor: palette.white,
          }}
          titleStyle={{
            fontFamily: 'Geometria-Bold',
            fontSize: 12,
            textTransform: 'uppercase',
            color: palette.lightGrey,
          }}
        >
          <View style={{ paddingHorizontal: spacing[6], marginTop: spacing[5] }}>
            {removePaymentRegulation ? (
              <Loader size='large' containerStyle={LOADER_STYLE} />
            ) : (
              paymentFields.map((item, i) => {
                return (
                  <PaymentRegulationFormField
                    key={i}
                    // @ts-ignore
                    item={item}
                    onDeleteItem={async (__, index) => {
                      setRemovePaymentRegulation(true);
                      await paymentMove(index, fields.length - 1);
                      setIsPaymentMoveCalled(!isPaymentMoveCalled);
                    }}
                  />
                );
              })
            )}
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
                marginBottom: spacing[5],
              }}
              onPress={() => {
                setPaymentCreation(true);
              }}
            >
              <RNVIcon name='plus' size={16} color={color.palette.secondaryColor} />
              <Text
                tx='invoiceFormScreen.paymentRegulationForm.add'
                style={{
                  color: color.palette.secondaryColor,
                  fontFamily: 'Geometria',
                  marginLeft: spacing[3],
                }}
              />
            </Button>
          </View>
        </List.Accordion>
      )}
      <View
        style={{
          ...ROW_STYLE,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingHorizontal: spacing[5],
          marginTop: spacing[4],
        }}
      >
        {checkInvoice === true && showMessage(translate('common.added'), { backgroundColor: palette.green })}
        {checkInvoice === false && showMessage(translate('errors.operation'), { backgroundColor: palette.pastelRed })}

        {/*{isLoading && <Loader size={'large'} animating={true} />}*/}
        <TouchableOpacity onPress={handleSubmit(handleInvoicePreviewPress)}>
          <View
            style={{
              borderColor: hasError ? palette.solidGrey : palette.secondaryColor,
              borderWidth: 2,
              borderRadius: 100,
              padding: spacing[3],
            }}
          >
            <MaterialIcons name='preview' size={25} color={hasError ? palette.solidGrey : palette.secondaryColor} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setInvoiceType(InvoiceStatus.DRAFT);
            setConfirmationModal(true);
          }}
        >
          <View
            style={{
              borderColor: hasError ? palette.solidGrey : palette.secondaryColor,
              borderWidth: 2,
              borderRadius: 100,
              padding: spacing[3],
            }}
          >
            <RNVIcon name='save' size={25} color={hasError ? palette.solidGrey : palette.secondaryColor} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            status === InvoiceStatus.CONFIRMED ? setInvoiceType(InvoiceStatus.CONFIRMED) : setInvoiceType(InvoiceStatus.PROPOSAL);
            setConfirmationModal(true);
          }}
        >
          <View
            style={{
              borderColor: hasError ? palette.solidGrey : palette.secondaryColor,
              borderWidth: 2,
              borderRadius: 100,
              padding: spacing[3],
            }}
          >
            <Octicons name='file-submodule' size={25} color={hasError ? palette.solidGrey : palette.secondaryColor} />
          </View>
        </TouchableOpacity>
      </View>
      <PaymentCreationModal open={paymentCreation} setOpen={setPaymentCreation} append={paymentAppend} />
      <InvoiceCreationModal
        invoiceType={invoiceType}
        confirmationModal={confirmationModal}
        setConfirmationModal={setConfirmationModal}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        status={status}
      />
    </View>
  );
};
