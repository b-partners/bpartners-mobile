import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { List } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

import { Button, Icon, Loader, Text } from '../../components';
import { DatePickerField } from '../../components/date-picker-field/date-picker-field';
import { translate } from '../../i18n';
import { useStores } from '../../models';
import { Customer } from '../../models/entities/customer/customer';
import { Invoice, InvoiceStatus, createInvoiceDefaultModel } from '../../models/entities/invoice/invoice';
import { PaymentRegulation } from '../../models/entities/payment-regulation/payment-regulation';
import { Product, createProductDefaultModel } from '../../models/entities/product/product';
import { TabNavigatorParamList, navigate } from '../../navigators';
import { color, spacing } from '../../theme';
import { palette } from '../../theme/palette';
import { showMessage } from '../../utils/snackbar';
import { LOADER_STYLE } from '../invoice-quotation/styles';
import { CustomerCreationModal } from './components/customer/customer-creation-modal';
import { CustomerFormFieldFooter } from './components/customer/customer-form-field-footer';
import { PaymentRegulationFormField } from './components/payment-regulation-form-field/payment-regulation-form-field';
import { ProductFormField } from './components/product-form-field/product-form-field';
import { SelectFormField } from './components/select-form-field/select-form-field';
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
  const { products, invoice, status, navigation } = props;
  const { invoiceStore, customerStore, draftStore, quotationStore } = useStores();
  const { checkInvoice } = invoiceStore;
  const { customers } = customerStore;
  const FIRST_CUSTOMER = customers.length > 0 ? customers[0] : null;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(FIRST_CUSTOMER);
  const [creationModal, setCreationModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [invoiceType, setInvoiceType] = useState(InvoiceStatus.DRAFT);
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: createInvoiceDefaultModel(invoiceType, invoice).create(),
  });

  const { fields, append, remove, update, move } = useFieldArray({ control, name: 'products' });
  const {
    fields: paymentFields,
    append: paymentAppend,
    remove: paymentRemove,
    update: paymentUpdate,
    move: paymentMove,
  } = useFieldArray({ control, name: 'paymentRegulations' });

  const [title, setTitle] = useState(null);
  const [comment, setComment] = useState(null);
  const [isMoveCalled, setIsMoveCalled] = useState(false);
  const [removeProduct, setRemoveProduct] = useState(false);
  const [quotationTitle, setQuotationTitle] = useState<String>('');

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
    reset();
  }, []);

  const onSubmit = async invoices => {
    try {
      await invoiceStore.saveInvoice({
        ...invoices,
        customer: selectedCustomer,
        comment: comment,
        title: title,
        metadata: { ...invoices.metadata, submittedAt: new Date() },
        status: invoiceType,
      });
      setConfirmationModal(false);
      if (invoiceType === InvoiceStatus.DRAFT) {
        navigateToTab('drafts');
        await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 10 });
        await quotationStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 10 });
      }
      if (invoiceType === InvoiceStatus.PROPOSAL) {
        navigateToTab('quotations');
        await quotationStore.getQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 10 });
        await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 10 });
      }
      if (invoiceType === InvoiceStatus.CONFIRMED) {
        navigateToTab('invoices');
        await invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: 10 });
      }
    } catch (e) {
      showMessage(e);
      throw e;
    } finally {
      reset();
      await draftStore.getAllDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 500 });
      await quotationStore.getAllQuotations({ status: InvoiceStatus.PROPOSAL, page: 1, pageSize: 500 });
    }
  };

  const handleInvoicePreviewPress = async invoices => {
    // TODO(UI): error handling
    setIsLoading(true);
    if (quotationTitle) {
      try {
        const savedInvoice = await invoiceStore.saveInvoice({
          ...invoices,
          customer: selectedCustomer,
          comment: comment,
          title: title,
          metadata: { ...invoices.metadata, submittedAt: new Date() },
        });
        setConfirmationModal(false);

        navigate('invoicePreview', {
          fileId: savedInvoice.fileId,
          invoiceTitle: savedInvoice.title,
          invoice: savedInvoice,
          situation: true,
        });
        invoiceType === 'DRAFT' && (await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: 10 }));
        invoiceType === 'PROPOSAL' &&
          (await quotationStore.getQuotations({
            status: InvoiceStatus.PROPOSAL,
            page: 1,
            pageSize: 10,
          }));
      } catch (e) {
        __DEV__ && console.tron.error(e.message, e.stacktrace);
        throw e;
      } finally {
        setIsLoading(false);
      }
    } else {
      showMessage(translate('errors.mandatoryTitle'), { backgroundColor: palette.pastelRed });
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
                  setQuotationTitle(newValue);
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
      <List.Accordion
        title='Produits'
        style={{ borderColor: '#E1E5EF', borderWidth: 1, height: 70, justifyContent: 'center' }}
        titleStyle={{ fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase', color: palette.lightGrey }}
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
      <List.Accordion
        title='Accompte'
        style={{ borderColor: '#E1E5EF', borderWidth: 1, height: 70, justifyContent: 'center' }}
        titleStyle={{ fontFamily: 'Geometria-Bold', fontSize: 12, textTransform: 'uppercase', color: palette.lightGrey }}
      >
        <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[5] }}>
          {removeProduct ? (
            <Loader size='large' containerStyle={LOADER_STYLE} />
          ) : (
            paymentFields.map((item, i) => {
              return <PaymentRegulationFormField key={i} item={item} />;
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
      <View style={ROW_STYLE}>
        <Controller
          name='customer'
          control={control}
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
      <View
        style={{
          ...ROW_STYLE,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingHorizontal: spacing[5],
        }}
      >
        {checkInvoice === true && showMessage(translate('common.added'), { backgroundColor: palette.green })}
        {checkInvoice === false && showMessage(translate('errors.operation'), { backgroundColor: palette.pastelRed })}

        {/*{isLoading && <Loader size={'large'} animating={true} />}*/}
        <TouchableOpacity onPress={handleSubmit(handleInvoicePreviewPress)}>
          <View
            style={{
              borderColor: color.palette.secondaryColor,
              borderWidth: 2,
              borderRadius: 100,
              padding: spacing[3],
            }}
          >
            <MaterialIcons name='preview' size={25} color={color.palette.secondaryColor} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (quotationTitle) {
              setInvoiceType(InvoiceStatus.DRAFT);
              setConfirmationModal(true);
            } else {
              showMessage(translate('errors.mandatoryTitle'), { backgroundColor: palette.pastelRed });
            }
          }}
        >
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
        <TouchableOpacity
          onPress={() => {
            if (quotationTitle) {
              status === InvoiceStatus.CONFIRMED ? setInvoiceType(InvoiceStatus.CONFIRMED) : setInvoiceType(InvoiceStatus.PROPOSAL);
              setConfirmationModal(true);
            } else {
              showMessage(translate('errors.mandatoryTitle'), { backgroundColor: palette.pastelRed });
            }
          }}
        >
          <View
            style={{
              borderColor: color.palette.secondaryColor,
              borderWidth: 2,
              borderRadius: 100,
              padding: spacing[3],
            }}
          >
            <Octicons name='file-submodule' size={25} color={color.palette.secondaryColor} />
          </View>
        </TouchableOpacity>
      </View>
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
