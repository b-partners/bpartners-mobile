import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { Checkbox, List } from 'react-native-paper';
import RNVIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { Button, DatePickerField, Icon, Loader, Text } from '../../../../components';
import { translate } from '../../../../i18n';
import { useStores } from '../../../../models';
import { Customer } from '../../../../models/entities/customer/customer';
import { InvoiceStatus, createInvoiceDefaultModel } from '../../../../models/entities/invoice/invoice';
import { PaymentRegulation } from '../../../../models/entities/payment-regulation/payment-regulation';
import { createProductDefaultModel } from '../../../../models/entities/product/product';
import { navigate } from '../../../../navigators/navigation-utilities';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { showMessage } from '../../../../utils/snackbar';
import { CustomerModal } from '../../../customer/components/customer-modal';
import { CustomerModalType } from '../../../customer/customers-screen';
import { LOADER_STYLE } from '../../../invoices/utils/styles';
import {
  DATE_PICKER_CONTAINER_STYLE,
  DATE_PICKER_LABEL_STYLE,
  DATE_PICKER_TEXT_STYLE,
  INVOICE_LABEL_STYLE,
  ROW_STYLE,
  invoiceFormStyles as styles,
} from '../../utils/styles';
import { CheckboxEnum, InvoiceFormProps, dateConversion, invoicePageSize } from '../../utils/utils';
import { CustomerFormFieldFooter } from '../customer/customer-form-field-footer';
import { PaymentCreationModal } from '../payment-regulation-form-field/payment-creation-modal';
import { PaymentRegulationDraftField } from '../payment-regulation-form-field/payment-regulation-draft-field';
import { PaymentRegulationFormField } from '../payment-regulation-form-field/payment-regulation-form-field';
import { ProductFormField } from '../product-form-field/product-form-field';
import { SelectFormField } from '../select-form-field/select-form-field';
import { InvoiceCreationModal } from './invoice-creation-modal';
import { InvoiceFormField } from './invoice-form-field';

export const InvoiceForm: React.FC<InvoiceFormProps> = props => {
  const { products, invoice, initialStatus, navigation, areaPictureId } = props;
  const { invoiceStore, customerStore, draftStore, quotationStore, areaPictureStore } = useStores();
  const { checkInvoice } = invoiceStore;
  const { customers } = customerStore;
  const { areaPicture } = areaPictureStore;

  // recover the most current customer from store and set it to the current selected customer
  const FIRST_CUSTOMER = customers.length > 0 ? customers[0] : null;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(FIRST_CUSTOMER);

  // initial state used
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [paymentCreation, setPaymentCreation] = useState(false);
  const [invoiceType, setInvoiceType] = useState(InvoiceStatus.DRAFT);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [annotationLoading, setAnnotationLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [removeProduct, setRemoveProduct] = useState(false);
  const [allowPaymentDelay, setAllowPaymentDelay] = useState<CheckboxEnum>(CheckboxEnum.UNCHECKED);
  const [payInInstalments, setPayInInstalments] = useState<CheckboxEnum>(CheckboxEnum.UNCHECKED);
  const [removePaymentRegulation, setRemovePaymentRegulation] = useState(false);
  const [totalPercent, setTotalPercent] = useState(0);
  const [currentPayment, setCurrentPayment] = useState<PaymentRegulation>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(null);
  const [customerModal, setCustomerModal] = useState<CustomerModalType>({
    type: 'CREATION',
    state: false,
    customer: null,
  });

  // use react-hook-form to control input data
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: 'all',
    defaultValues: createInvoiceDefaultModel(invoiceType, invoice).create(),
  });

  // use useFieldArray to easily control products in a table
  const {
    fields: productFields,
    append: productAppend,
    remove: productRemove,
    update: productUpdate,
  } = useFieldArray({
    control,
    name: 'products',
    rules: {
      required: translate('errors.required'),
    },
  });

  // use useFieldArray to easily control payment regulations in a table
  const {
    fields: paymentFields,
    remove: paymentRemove,
    append: paymentAppend,
  } = useFieldArray({
    control,
    name: 'paymentRegulations',
  });

  // check if title, reference, products or customer contains an error
  const hasError = errors.title || errors.ref || errors.products || errors.customer;

  // function to navigate to the invoice screen, but in a specific tab: drafts, quotations or invoices
  const navigateToTab = (tab: string) => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'paymentList', params: { initialRoute: tab } }],
    });
  };

  useEffect(() => {
    // if it's editing, retrieve all payment regulations, store them in react-hook-form and display them on screen
    if (paymentFields.length > 1) {
      setPayInInstalments(CheckboxEnum.CHECKED);
      let temp = [];
      paymentFields.forEach(item => {
        setTotalPercent(prevTotalPercent => prevTotalPercent + item.paymentRequest.percentValue);
        const newItem = {
          maturityDate: item.maturityDate,
          percent: item.paymentRequest.percentValue,
          comment: item.comment,
          amount: item.amount,
        };
        temp.push(newItem);
      });
      setValue('paymentRegulations', temp as any);
    }
    const days = watch('delayInPaymentAllowed');
    const percent = watch('delayPenaltyPercent');
    if (days || percent) {
      setAllowPaymentDelay(CheckboxEnum.CHECKED);
    }
  }, []);

  useEffect(() => {
    if (currentPayment !== null) {
      setPaymentCreation(true);
    }
  }, [currentPayment]);

  // function called when the button that allow payment delay is clicked
  const togglePaymentDelay = () => {
    if (allowPaymentDelay === CheckboxEnum.CHECKED) {
      setValue('delayInPaymentAllowed', null);
      setValue('delayPenaltyPercent', null);
      setAllowPaymentDelay(CheckboxEnum.UNCHECKED);
    } else {
      setAllowPaymentDelay(CheckboxEnum.CHECKED);
    }
  };

  // function called when the button that allow payment regulations is clicked
  const togglePaymentRegulation = () => {
    if (payInInstalments === CheckboxEnum.CHECKED) {
      paymentFields.length = 0;
      setPayInInstalments(CheckboxEnum.UNCHECKED);
    } else {
      setPayInInstalments(CheckboxEnum.CHECKED);
    }
  };

  // used to save an invoice
  const onSubmit = async (invoices: { metadata: any; paymentRegulations: any }) => {
    setCreationLoading(true);
    try {
      // if the user has created payment regulations, but the total does not reach 100%
      if (payInInstalments === CheckboxEnum.CHECKED && totalPercent < 10000) {
        // create a payment regulation with the last payment maturity date and with the rest of the percent
        const latestPayment = paymentFields[paymentFields.length - 1];
        const dateObj = new Date(latestPayment.maturityDate);
        dateObj.setMonth(dateObj.getMonth() + 1);
        const formattedDate = dateConversion(dateObj);
        const restToPay = {
          maturityDate: formattedDate,
          comment: null,
          percent: 10000 - totalPercent,
          amount: null,
        };

        // save the invoice with payment regulations and the rest to pay
        await invoiceStore.saveInvoice({
          ...invoices,
          customer: selectedCustomer,
          metadata: { ...invoices.metadata, submittedAt: new Date() },
          status: invoiceType,
          paymentRegulations: [...invoices.paymentRegulations, restToPay],
          paymentType: 'IN_INSTALMENT',
          idAreaPicture: areaPictureId ?? null,
        });

        // if the user has created payment regulations, but the total reaches 100%
      } else if (payInInstalments === CheckboxEnum.CHECKED && totalPercent === 10000) {
        // save the invoice with payment regulations
        await invoiceStore.saveInvoice({
          ...invoices,
          customer: selectedCustomer,
          metadata: { ...invoices.metadata, submittedAt: new Date() },
          status: invoiceType,
          paymentType: 'IN_INSTALMENT',
          idAreaPicture: areaPictureId ?? null,
        });

        // if there is no payment regulation
      } else {
        // create an invoice normally
        await invoiceStore.saveInvoice({
          ...invoices,
          customer: selectedCustomer,
          metadata: { ...invoices.metadata, submittedAt: new Date() },
          status: invoiceType,
          idAreaPicture: areaPictureId ?? null,
        });
      }
      setConfirmationModal(false);

      // if the invoice status is DRAFT, navigate to drafts tab and refresh drafts and quotations lists
      if (invoiceType === InvoiceStatus.DRAFT) {
        navigateToTab('drafts');
        await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: invoicePageSize });
        await quotationStore.getQuotations({
          status: InvoiceStatus.PROPOSAL,
          page: 1,
          pageSize: invoicePageSize,
        });
      }

      // if the invoice status is PROPOSAL, navigate to quotations tab and refresh drafts and quotations lists
      if (invoiceType === InvoiceStatus.PROPOSAL) {
        navigateToTab('quotations');
        await quotationStore.getQuotations({
          status: InvoiceStatus.PROPOSAL,
          page: 1,
          pageSize: invoicePageSize,
        });
        await draftStore.getDrafts({ status: InvoiceStatus.DRAFT, page: 1, pageSize: invoicePageSize });
      }

      // if the invoice status is CONFIRMED, navigate to invoices tab and refresh invoices lists
      if (invoiceType === InvoiceStatus.CONFIRMED) {
        navigateToTab('invoices');
        await invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, page: 1, pageSize: invoicePageSize });
      }
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.yellow });

      throw e;
    } finally {
      setCreationLoading(false);
      reset();
    }
  };

  // used to preview an invoice
  const handleInvoicePreviewPress = async (invoices: { metadata: any; paymentRegulations: any }) => {
    setPreviewLoading(true);

    // save an invoice before preview
    let savedInvoice: { fileId: any; title: any };

    try {
      // if the user has created payment regulations, but the total does not reach 100%
      if (payInInstalments === CheckboxEnum.CHECKED && totalPercent < 10000) {
        // create a payment regulation with the last payment maturity date and with the rest of the percent
        const latestPayment = paymentFields[paymentFields.length - 1];
        const dateObj = new Date(latestPayment.maturityDate);
        dateObj.setMonth(dateObj.getMonth() + 1);
        const formattedDate = dateConversion(dateObj);
        const restToPay = {
          maturityDate: formattedDate,
          comment: null,
          percent: 10000 - totalPercent,
          amount: null,
        };

        // save the invoice with payment regulations and the rest to pay
        savedInvoice = await invoiceStore.saveInvoice({
          ...invoices,
          customer: selectedCustomer,
          status: invoiceType,
          paymentType: 'IN_INSTALMENT',
          metadata: { ...invoices.metadata, submittedAt: new Date() },
          paymentRegulations: [...invoices.paymentRegulations, restToPay],
        });

        // if the user has created payment regulations, but the total reaches 100%
      } else if (payInInstalments === CheckboxEnum.CHECKED && totalPercent === 10000) {
        // save the invoice with payment regulations
        savedInvoice = await invoiceStore.saveInvoice({
          ...invoices,
          customer: selectedCustomer,
          paymentType: 'IN_INSTALMENT',
          metadata: { ...invoices.metadata, submittedAt: new Date() },
          status: invoiceType,
        });

        // if there is no payment regulation
      } else {
        // create an invoice normally
        savedInvoice = await invoiceStore.saveInvoice({
          ...invoices,
          customer: selectedCustomer,
          metadata: { ...invoices.metadata, submittedAt: new Date() },
          status: invoiceType,
        });
      }
      setConfirmationModal(false);

      // navigate to invoice preview screen with the invoice id
      navigate('invoicePreview', {
        fileId: savedInvoice.fileId,
        invoiceTitle: savedInvoice.title,
        invoice: savedInvoice,
        situation: true,
      });

      // refresh drafts or quotations lists
      invoiceType === 'DRAFT' &&
        (await draftStore.getDrafts({
          status: InvoiceStatus.DRAFT,
          page: 1,
          pageSize: invoicePageSize,
        }));
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
      setPreviewLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
                type={'date'}
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
                type={'date'}
              />
            );
          }}
        />
      </View>
      <View style={styles.paymentDelayContainer}>
        <Checkbox.Item
          status={allowPaymentDelay}
          onPress={togglePaymentDelay}
          color={palette.secondaryColor}
          style={{ width: '10%' }}
          mode={'android'}
          label={''}
        />
        <Text tx={'invoiceFormScreen.invoiceForm.delayPaymentLabel'} style={styles.paymentDelayLabel} numberOfLines={2} />
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
            validate: {
              isRequired: () => selectedCustomer !== null,
            },
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
                selectContainerStyle={{ ...styles.customerForm, borderColor: errors.customer ? palette.pastelRed : '#E1E5EF' }}
                style={INVOICE_LABEL_STYLE}
              />
            );
          }}
        />
      </View>
      <Button
        onPress={() => {
          customerStore.saveCustomerInit();
          setCustomerModal({
            type: 'CREATION',
            state: true,
            customer: null,
          });
        }}
        style={styles.customerButton}
      >
        <RNVIcon name='plus' color={color.palette.secondaryColor} size={15} />
        <Text tx='invoiceFormScreen.customerSelectionForm.addClient' style={styles.customerLabel} />
      </Button>
      <CustomerModal modal={customerModal} setModal={setCustomerModal} />
      <List.Accordion
        title='Produits'
        style={{ ...styles.productAccordion, borderColor: errors.products ? palette.pastelRed : '#E1E5EF' }}
        titleStyle={{ ...styles.productTitle, color: errors.products ? palette.pastelRed : palette.lighterGrey }}
      >
        <View style={styles.productContainer}>
          {removeProduct ? (
            <Loader size='large' containerStyle={LOADER_STYLE} />
          ) : (
            productFields.map((item, i) => {
              return (
                <ProductFormField
                  key={i}
                  index={i}
                  // @ts-ignore
                  temp={item}
                  items={products}
                  onDeleteItem={async (__, index) => {
                    setRemoveProduct(true);
                    productRemove(index);
                    setRemoveProduct(false);
                  }}
                  onValueChange={product => {
                    productUpdate(i, product);
                  }}
                />
              );
            })
          )}
        </View>
        <View style={{ ...ROW_STYLE, paddingHorizontal: spacing[3] }}>
          <Button
            style={styles.productButton}
            onPress={() => {
              const product = createProductDefaultModel().create();
              productAppend(product);
            }}
          >
            <RNVIcon name='plus' size={16} color={color.palette.secondaryColor} />
            <Text tx='invoiceFormScreen.productForm.addProduct' style={styles.productLabel} />
          </Button>
        </View>
      </List.Accordion>
      <View style={styles.paymentRegulationContainer}>
        <Checkbox.Item
          status={payInInstalments}
          onPress={togglePaymentRegulation}
          color={palette.secondaryColor}
          style={{ width: '10%' }}
          mode={'android'}
          label={''}
        />
        <Text tx={'invoiceFormScreen.paymentRegulationForm.payIn'} style={styles.paymentRegulationLabel} numberOfLines={2} />
      </View>
      {payInInstalments === CheckboxEnum.CHECKED && (
        <List.Accordion title='Accompte' style={styles.paymentRegulationAccordion} titleStyle={styles.paymentRegulationTitle}>
          <View style={styles.paymentRegulationFormContainer}>
            {removePaymentRegulation ? (
              <Loader size='large' containerStyle={LOADER_STYLE} />
            ) : (
              paymentFields.map((item, i) => {
                return (
                  <>
                    <PaymentRegulationFormField
                      key={i}
                      index={i}
                      // @ts-ignore
                      item={item}
                      setCurrentIndex={setCurrentIndex}
                      setCurrentPayment={setCurrentPayment}
                      paymentRemove={paymentRemove}
                      setTotalPercent={setTotalPercent}
                      onDeleteItem={(__, index, percent) => {
                        setRemovePaymentRegulation(true);
                        if (index === 0 && paymentFields.length === 1) {
                          paymentRemove(0);
                          setPayInInstalments(CheckboxEnum.UNCHECKED);
                          setTotalPercent(0);
                        } else {
                          setTotalPercent(prevTotalPercent => prevTotalPercent - percent);
                          paymentRemove(index);
                        }
                        setRemovePaymentRegulation(false);
                      }}
                    />
                  </>
                );
              })
            )}
            {totalPercent > 0 && totalPercent < 10000 && <PaymentRegulationDraftField percent={totalPercent} />}
          </View>
          <View style={styles.paymentRegulationButtonContainer}>
            <Button
              style={styles.paymentRegulationButton}
              onPress={() => {
                setCurrentPayment(null);
                setPaymentCreation(true);
              }}
            >
              <RNVIcon name='plus' size={16} color={color.palette.secondaryColor} />
              <Text tx='invoiceFormScreen.paymentRegulationForm.add' style={styles.paymentRegulationButtonLabel} />
            </Button>
          </View>
        </List.Accordion>
      )}
      <View style={styles.buttonActionContainer}>
        {checkInvoice === true && showMessage(translate('common.added'), { backgroundColor: palette.green })}
        {checkInvoice === false && showMessage(translate('errors.operation'), { backgroundColor: palette.pastelRed })}

        {invoice?.idAreaPicture && (
          <TouchableOpacity
            onPress={async () => {
              setAnnotationLoading(true);
              await areaPictureStore.getAreaPicture(invoice.idAreaPicture);
              await areaPictureStore.getAreaPictureAnnotations(invoice.idAreaPicture);
              await areaPictureStore.getPictureUrl(areaPicture.fileId);
              setAnnotationLoading(false);
              navigation.navigate('annotator');
            }}
          >
            <View style={{ ...styles.areaPictureButtonContainer, borderColor: hasError ? palette.solidGrey : palette.secondaryColor }}>
              {annotationLoading ? (
                <Loader size={25} animating={true} color={palette.secondaryColor} />
              ) : (
                <MaterialCommunityIcons name='image-area' size={25} color={hasError ? palette.solidGrey : palette.secondaryColor} />
              )}
            </View>
          </TouchableOpacity>
        )}

        {previewLoading ? (
          <View style={styles.previewButtonContainer}>
            <Loader size={30} animating={true} color={palette.secondaryColor} />
          </View>
        ) : (
          <TouchableOpacity onPress={handleSubmit(handleInvoicePreviewPress)}>
            <View style={{ ...styles.buttonAction, borderColor: hasError ? palette.solidGrey : palette.secondaryColor }}>
              <MaterialIcons name='preview' size={25} color={hasError ? palette.solidGrey : palette.secondaryColor} />
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            setInvoiceType(InvoiceStatus.DRAFT);
            setConfirmationModal(true);
          }}
        >
          <View style={{ ...styles.buttonAction, borderColor: hasError ? palette.solidGrey : palette.secondaryColor }}>
            <RNVIcon name='save' size={25} color={hasError ? palette.solidGrey : palette.secondaryColor} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            initialStatus === InvoiceStatus.CONFIRMED ? setInvoiceType(InvoiceStatus.CONFIRMED) : setInvoiceType(InvoiceStatus.PROPOSAL);
            setConfirmationModal(true);
          }}
        >
          <View style={{ ...styles.buttonAction, borderColor: hasError ? palette.solidGrey : palette.secondaryColor }}>
            <Octicons name='file-submodule' size={25} color={hasError ? palette.solidGrey : palette.secondaryColor} />
          </View>
        </TouchableOpacity>
      </View>
      {paymentCreation && (
        <PaymentCreationModal
          open={paymentCreation}
          setOpen={setPaymentCreation}
          append={paymentAppend}
          totalPercent={totalPercent}
          setTotalPercent={setTotalPercent}
          item={currentPayment}
          paymentRemove={paymentRemove}
          index={currentIndex}
          setCurrentPayment={setCurrentPayment}
        />
      )}
      {!hasError && (
        <InvoiceCreationModal
          invoiceType={invoiceType}
          confirmationModal={confirmationModal}
          setConfirmationModal={setConfirmationModal}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          status={initialStatus}
          loading={creationLoading}
        />
      )}
    </View>
  );
};
