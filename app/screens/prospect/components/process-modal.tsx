import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { InputField, Text } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import RadioButton from '../../../components/radio-button/radio-button';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { Invoice, InvoiceStatus, SearchInvoice } from '../../../models/entities/invoice/invoice';
import { ProspectStatus } from '../../../models/entities/prospect/prospect';
import { navigate } from '../../../navigators/navigation-utilities';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { amountToMajors, amountToMinors } from '../../../utils/money';
import { showMessage } from '../../../utils/snackbar';
import { invoicePageSize } from '../../invoice-form/utils/utils';
import { InvoiceSelectionModal } from '../../transaction/components/invoice-selection-modal';
import { TransactionField } from '../../transaction/components/transaction-field';
import { transactionModalStyles as styles } from '../../transaction/utils/styles';
import { CHECKED, CHECKED_TEXT, UNCHECKED, UNCHECKED_TEXT } from '../utils/styles';
import { ProcessModalProps, ProspectFeedback } from '../utils/utils';
import { ButtonActions } from './button-action';

export const ProcessModal: React.FC<ProcessModalProps> = props => {
  const { showModal, setShowModal, prospect, setCurrentStatus, status, setStatus, isEditing, setIsEditing } = props;

  const { prospectStore, quotationStore, invoiceStore } = useStores();

  const { invoices, paidInvoices } = invoiceStore;

  const { quotations } = quotationStore;

  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [current, setCurrent] = React.useState<ProspectFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();
  const [amount, setAmount] = useState(amountToMajors(prospect?.contractAmount)?.toString());

  const closeModal = () => {
    setStatus(null);
    setCurrent(null);
    setSelectedInvoice(null);
    setCurrentPage(1);
    setIsEditing(false);
    setShowModal(false);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: prospect?.email,
      phone: prospect?.phone,
      address: prospect?.address,
      name: prospect?.name,
      firstName: prospect?.firstName,
      comment: prospect?.comment,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const commonFetchParams = { page: 1, pageSize: invoicePageSize };
        if (!selectedInvoice && prospect?.invoiceID) {
          const associatedInvoice = await invoiceStore.getInvoice(prospect.invoiceID);
          setSelectedInvoice(associatedInvoice);
        } else if (prospect?.status === 'TO_CONTACT') {
          await quotationStore.getQuotations({ status: InvoiceStatus.PROPOSAL, ...commonFetchParams });
        } else {
          await invoiceStore.getInvoices({ status: InvoiceStatus.CONFIRMED, ...commonFetchParams });
          await invoiceStore.getPaidInvoices({ status: InvoiceStatus.PAID, ...commonFetchParams });
        }
      } catch {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
        setVisible(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isVisible]);

  const invoiceHandler = () => {
    return prospect?.status === 'TO_CONTACT' ? quotations : invoices.concat(paidInvoices);
  };

  const handleSelectedInvoice = (invoice: Invoice | SearchInvoice) => {
    setSelectedInvoice(invoice as Invoice);
  };

  const handleAmountRender = () => {
    setCurrentPage(2);
  };

  const handleStatus = () => {
    if (status && (current === ProspectFeedback.NOT_INTERESTED || current === ProspectFeedback.PROPOSAL_DECLINED)) {
      return ProspectStatus.TO_CONTACT;
    } else if (status === null) {
      return prospect?.status;
    } else {
      return status;
    }
  };

  const onSubmit = async prospectInfos => {
    setIsButtonLoading(true);

    const prospectToBeEdited = {
      ...prospect,
      name: prospectInfos.name,
      firstName: prospectInfos.firstName,
      status: handleStatus(),
      email: prospectInfos.email,
      phone: prospectInfos.phone,
      address: prospectInfos.address,
      comment: prospectInfos.comment,
      contractAmount: amountToMinors(parseInt(amount, 10)),
      prospectFeedback: current,
      // @ts-ignore
      invoiceID: selectedInvoice?.id || null,
    };
    delete prospectToBeEdited.location;
    try {
      await prospectStore.updateProspects(prospectToBeEdited.id, prospectToBeEdited);
      setTimeout(() => {
        showMessage(translate('common.addedOrUpdated'), { backgroundColor: palette.green });
      }, 1500);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.yellow });
      throw e;
    } finally {
      setIsButtonLoading(false);
      closeModal();
      await prospectStore.getProspects();
      setCurrentStatus(handleStatus());
    }
  };

  const handleAmountChange = value => {
    const regex = /^\d*$/;
    if (regex.test(value)) {
      setAmount(value);
    }
  };

  return (
    <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
      <Modal
        visible={showModal}
        dismissableBackButton={true}
        onDismiss={closeModal}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: keyboardOpen ? 'flex-start' : 'center',
        }}
      >
        <View
          style={{
            backgroundColor: palette.white,
            borderRadius: 20,
            marginHorizontal: '2%',
            width: '96%',
            height: keyboardOpen ? 420 : 540,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              height: 60,
              width: '100%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View
              style={{
                height: '100%',
                width: '85%',
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: spacing[4],
              }}
            >
              <Text text={'Prospect : '} style={{ fontSize: 18, color: palette.secondaryColor }} />
              <Text text={prospect?.name} style={{ fontSize: 18, color: palette.secondaryColor }} />
            </View>
            <TouchableOpacity onPress={closeModal} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <AntDesignIcon name='close' color={color.palette.lightGrey} size={20} />
            </TouchableOpacity>
          </View>
          {currentPage === 1 ? (
            <ScrollView style={{ width: '100%', height: '100%', paddingHorizontal: spacing[4], paddingTop: spacing[2] }}>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='email'
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'prospectScreen.process.email'}
                      error={!!errors.email}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.email?.message}
                      backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='phone'
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'prospectScreen.process.phone'}
                      error={!!errors.phone}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.phone?.message}
                      backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='address'
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'prospectScreen.process.address'}
                      error={!!errors.address}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.address?.message}
                      backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='name'
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'prospectScreen.process.name'}
                      error={!!errors.name}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.name?.message}
                      backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='firstName'
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'prospectScreen.process.firstName'}
                      error={!!errors.firstName}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.firstName?.message}
                      backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='comment'
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'prospectScreen.process.comment'}
                      error={!!errors.comment}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.comment?.message}
                      backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                    />
                  )}
                />
              </View>
            </ScrollView>
          ) : (
            <ScrollView style={{ width: '100%', height: '100%', paddingHorizontal: spacing[4], paddingTop: spacing[2] }}>
              <TouchableOpacity style={styles.navigation} onPress={() => setVisible(true)}>
                <View style={styles.transactionIcon}>
                  <SimpleLineIcons name='paper-clip' size={18} color={palette.secondaryColor} />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    tx={
                      prospect?.status === ProspectStatus.TO_CONTACT
                        ? 'prospectScreen.process.associateWithAQuotation'
                        : 'prospectScreen.process.associateWithAnInvoice'
                    }
                    style={{
                      color: palette.black,
                      fontSize: 18,
                      fontFamily: 'Geometria',
                    }}
                  />
                </View>
                <View style={styles.transactionIcon}>
                  <EntypoIcon name='chevron-thin-right' size={18} color='#000' />
                </View>
              </TouchableOpacity>
              {selectedInvoice && (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    marginVertical: spacing[1],
                    paddingVertical: spacing[2],
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: palette.lighterGrey,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    navigate('invoicePreview', {
                      fileId: selectedInvoice.fileId,
                      invoiceTitle: selectedInvoice.title,
                      invoice: selectedInvoice,
                      situation: false,
                    });
                    closeModal();
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      width: 70,
                      height: 25,
                      top: 8,
                      right: -15,
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 10,
                    }}
                  >
                    <IoniconIcon name='eye-sharp' size={15} color={color.palette.secondaryColor} />
                  </View>
                  <TransactionField
                    label={
                      prospect?.status === ProspectStatus.TO_CONTACT ? 'prospectScreen.process.associatedQuotation' : 'prospectScreen.process.associatedInvoice'
                    }
                    text={selectedInvoice?.ref}
                  />
                </TouchableOpacity>
              )}
              <View
                style={{
                  width: '100%',
                  marginVertical: spacing[2],
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Text tx={'prospectScreen.process.amountLabel'} style={{ color: palette.lightGrey }} />
              </View>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <InputField
                  keyboardType={'numeric'}
                  labelTx={'prospectScreen.process.amount'}
                  error={null}
                  value={amount}
                  onChange={value => handleAmountChange(value)}
                  errorMessage={''}
                  backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                />
              </View>
              {!isEditing && (
                <View style={{ flex: 1, paddingTop: spacing[2] }}>
                  {prospect?.status === ProspectStatus.TO_CONTACT ? (
                    <>
                      <TouchableOpacity
                        style={current === ProspectFeedback.INTERESTED ? CHECKED : UNCHECKED}
                        onPress={() => setCurrent(ProspectFeedback.INTERESTED)}
                      >
                        <RadioButton isActive={current === ProspectFeedback.INTERESTED} />
                        <Text tx={'prospectScreen.process.interested'} style={current === ProspectFeedback.INTERESTED ? CHECKED_TEXT : UNCHECKED_TEXT} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={current === ProspectFeedback.NOT_INTERESTED ? CHECKED : UNCHECKED}
                        onPress={() => setCurrent(ProspectFeedback.NOT_INTERESTED)}
                      >
                        <RadioButton isActive={current === ProspectFeedback.NOT_INTERESTED} />
                        <Text tx={'prospectScreen.process.notInterested'} style={current === ProspectFeedback.NOT_INTERESTED ? CHECKED_TEXT : UNCHECKED_TEXT} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={current === ProspectFeedback.PROPOSAL_SENT ? CHECKED : UNCHECKED}
                        onPress={() => setCurrent(ProspectFeedback.PROPOSAL_SENT)}
                      >
                        <RadioButton isActive={current === ProspectFeedback.PROPOSAL_SENT} />
                        <Text tx={'prospectScreen.process.proposalSent'} style={current === ProspectFeedback.PROPOSAL_SENT ? CHECKED_TEXT : UNCHECKED_TEXT} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={current === ProspectFeedback.PROPOSAL_ACCEPTED ? CHECKED : UNCHECKED}
                        onPress={() => setCurrent(ProspectFeedback.PROPOSAL_ACCEPTED)}
                      >
                        <RadioButton isActive={current === ProspectFeedback.PROPOSAL_ACCEPTED} />
                        <Text
                          tx={'prospectScreen.process.proposalAccepted'}
                          style={current === ProspectFeedback.PROPOSAL_ACCEPTED ? CHECKED_TEXT : UNCHECKED_TEXT}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={current === ProspectFeedback.PROPOSAL_DECLINED ? CHECKED : UNCHECKED}
                        onPress={() => setCurrent(ProspectFeedback.PROPOSAL_DECLINED)}
                      >
                        <RadioButton isActive={current === ProspectFeedback.PROPOSAL_DECLINED} />
                        <Text
                          tx={'prospectScreen.process.proposalDeclined'}
                          style={current === ProspectFeedback.PROPOSAL_DECLINED ? CHECKED_TEXT : UNCHECKED_TEXT}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={current === ProspectFeedback.INVOICE_SENT ? CHECKED : UNCHECKED}
                        onPress={() => setCurrent(ProspectFeedback.INVOICE_SENT)}
                      >
                        <RadioButton isActive={current === ProspectFeedback.INVOICE_SENT} />
                        <Text tx={'prospectScreen.process.invoiceSent'} style={current === ProspectFeedback.INVOICE_SENT ? CHECKED_TEXT : UNCHECKED_TEXT} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
              <InvoiceSelectionModal
                showModal={isVisible}
                setShowModal={setVisible}
                invoices={invoiceHandler()}
                loading={isLoading}
                getSelectedInvoice={handleSelectedInvoice}
              />
            </ScrollView>
          )}
          <View
            style={{
              height: 60,
              width: '100%',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              justifyContent: 'flex-end',
              paddingRight: spacing[4],
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <ButtonActions
              isLoading={isButtonLoading}
              isEditing={isEditing}
              prospectStatus={prospect?.status}
              selectedStatus={status}
              prospectFeedBack={current}
              currentPage={currentPage}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              handleAmountRender={handleAmountRender}
              closeModal={closeModal}
              setCurrentPage={setCurrentPage}
            />
          </View>
        </View>
      </Modal>
    </KeyboardLayout>
  );
};
