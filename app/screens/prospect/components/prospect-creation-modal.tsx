import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { InputField, Text } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { useStores } from '../../../models';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { ProspectCreationModalProps, ProspectFeedback } from '../utils/utils';
import { ButtonActions } from './button-action';

export const ProspectCreationModal: React.FC<ProspectCreationModalProps> = props => {
  const { showModal, setShowModal, status, setStatus } = props;

  const { prospectStore } = useStores();

  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [current, setCurrent] = React.useState<ProspectFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [amount, setAmount] = useState();

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
      email: '',
      phone: '',
      address: '',
      name: '',
      comment: '',
    },
  });

  const handleAmountRender = () => {
    setCurrentPage(2);
  };

  const onSubmit = async prospectInfos => {
    setIsLoading(true);
    try {
      // await prospectStore.updateProspects(prospectToBeEdited.id, prospectToBeEdited);
    } catch (e) {
      showMessage(e);
      throw e;
    } finally {
      setIsLoading(false);
      closeModal();
      await prospectStore.getProspects();
      // setCurrentStatus(editedStatus);
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
              <Text text={''} style={{ fontSize: 15, color: palette.secondaryColor }} />
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
            <ButtonActions
              isLoading={isLoading}
              prospectStatus={status}
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
