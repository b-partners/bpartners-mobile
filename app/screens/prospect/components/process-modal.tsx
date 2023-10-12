import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { Button, InputField, Loader, Text } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { useStores } from '../../../models';
import { ProspectStatus } from '../../../models/entities/prospect/prospect';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { amountToMajors, amountToMinors } from '../../../utils/money';
import { showMessage } from '../../../utils/snackbar';
import RadioButton from '../../invoice-form/components/select-form-field/radio-button';
import { SHADOW_STYLE } from '../../invoices/utils/styles';
import { CHECKED, CHECKED_TEXT, UNCHECKED, UNCHECKED_TEXT } from '../utils/styles';
import { ProcessModalProps, ProspectFeedback } from '../utils/utils';

export const ProcessModal: React.FC<ProcessModalProps> = props => {
  const { prospectStore } = useStores();
  const { showModal, setShowModal, prospect, setCurrentStatus, status, setStatus } = props;
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [current, setCurrent] = React.useState<ProspectFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [amount, setAmount] = useState(amountToMajors(prospect.contractAmount).toString());
  const closeModal = () => {
    setStatus(null);
    setCurrent(null);
    setCurrentPage(1);
    setShowModal(false);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: prospect.email,
      phone: prospect.phone,
      address: prospect.address,
      name: prospect.name,
      comment: prospect.comment,
    },
  });

  const handleAmountRender = () => {
    setCurrentPage(2);
  };

  const onSubmit = async prospectInfos => {
    setIsLoading(true);
    const editedStatus = current === ProspectFeedback.NOT_INTERESTED || current === ProspectFeedback.PROPOSAL_DECLINED ? ProspectStatus.TO_CONTACT : status;
    const prospectToBeEdited = {
      ...prospect,
      name: prospectInfos.name,
      email: prospectInfos.email,
      phone: prospectInfos.phone,
      address: prospectInfos.address,
      comment: prospectInfos.comment,
      contractAmount: amountToMinors(parseInt(amount, 10)),
      status: editedStatus,
    };
    delete prospectToBeEdited.location;
    try {
      await prospectStore.updateProspects(prospectToBeEdited.id, prospectToBeEdited);
    } catch (e) {
      showMessage(e);
      throw e;
    } finally {
      setIsLoading(false);
      closeModal();
      await prospectStore.getProspects();
      setCurrentStatus(editedStatus);
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
            height: 450,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              width: '100%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View style={{ height: '100%', width: '85%', flexDirection: 'row', alignItems: 'center', paddingLeft: spacing[4] }}>
              <Text text={'Prospect : '} style={{ fontSize: 15, color: palette.secondaryColor }} />
              <Text text={prospect?.name} style={{ fontSize: 15, color: palette.secondaryColor }} />
            </View>
            <TouchableOpacity onPress={closeModal} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <AntDesignIcon name='close' color={color.palette.lightGrey} size={20} />
            </TouchableOpacity>
          </View>
          {currentPage === 1 ? (
            <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[2] }}>
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
            </View>
          ) : (
            <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[2] }}>
              <View style={{ width: '100%', marginVertical: spacing[2], flexDirection: 'column', alignItems: 'center' }}>
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
              {prospect.status === ProspectStatus.TO_CONTACT ? (
                <View style={{ flex: 1, paddingTop: spacing[4] }}>
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
                </View>
              ) : (
                <View style={{ flex: 1, paddingTop: spacing[4] }}>
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
                </View>
              )}
            </View>
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
            <Button
              tx={currentPage === 1 ? 'common.cancel' : 'common.back'}
              style={{
                ...SHADOW_STYLE,
                backgroundColor: palette.secondaryColor,
                borderRadius: 10,
                paddingVertical: spacing[3],
                paddingHorizontal: spacing[2],
                width: 110,
                height: 40,
                marginRight: spacing[2],
              }}
              onPress={() => {
                currentPage === 1 ? closeModal() : setCurrentPage(1);
              }}
              textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }}
            />
            {isLoading ? (
              <View style={{ paddingVertical: spacing[3], paddingHorizontal: spacing[2], width: 100, height: 40 }}>
                <Loader size={20} color={palette.secondaryColor} />
              </View>
            ) : current === null && currentPage === 2 ? (
              <View
                style={{
                  backgroundColor: palette.solidGrey,
                  borderRadius: 10,
                  paddingVertical: spacing[3],
                  paddingHorizontal: spacing[2],
                  width: 110,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text tx={'prospectScreen.process.reserve'} style={{ color: palette.lighterGrey }} />
              </View>
            ) : (
              <Button
                tx={currentPage === 1 ? 'common.next' : 'prospectScreen.process.reserve'}
                style={{
                  ...SHADOW_STYLE,
                  backgroundColor: palette.secondaryColor,
                  borderRadius: 10,
                  paddingVertical: spacing[3],
                  paddingHorizontal: spacing[2],
                  width: 100,
                  height: 40,
                }}
                onPress={currentPage !== 1 ? handleSubmit(onSubmit) : handleAmountRender}
                textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }}
              />
            )}
          </View>
        </View>
      </Modal>
    </KeyboardLayout>
  );
};
