import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { Button, InputField, Text } from '../../../components';
import { translate } from '../../../i18n';
import { ProspectStatus } from '../../../models/entities/prospect/prospect';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { commaValidation } from '../../../utils/comma-to-dot';
import { showMessage } from '../../../utils/snackbar';
import RadioButton from '../../invoice-form/components/select-form-field/radio-button';
import { SHADOW_STYLE } from '../../invoices/utils/styles';
import { Log } from '../../welcome/utils/utils';
import { CHECKED, CHECKED_TEXT, UNCHECKED, UNCHECKED_TEXT } from '../utils/styles';
import { ProcessModalProps, ProspectEnum } from '../utils/utils';

export const ProcessModal: React.FC<ProcessModalProps> = props => {
  const { showModal, setShowModal, prospect } = props;
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [current, setCurrent] = React.useState<ProspectEnum | null>();

  const closeModal = () => {
    setCurrent(null);
    setCurrentPage(1);
    setShowModal(false);
  };

  useEffect(() => {
    Log(prospect);
  }, []);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: prospect.email,
      phone: prospect.phone,
      address: prospect.address,
      name: prospect.name,
      comment: prospect.comment,
      amount: '',
    },
  });

  const handleAmountRender = () => {
    setCurrentPage(2);
    setValue('amount', '');
    const amount = watch('amount');
    Log('This is amount :' + amount);
  };

  const onSubmit = async processInfos => {
    try {
      Log(processInfos);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      throw e;
    }
  };

  return (
    <Modal
      visible={showModal}
      dismissableBackButton={true}
      onDismiss={closeModal}
      style={{
        width: '100%',
        height: '100%',
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
                    backgroundColor={palette.solidGrey}
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
                    backgroundColor={palette.solidGrey}
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
                    backgroundColor={palette.solidGrey}
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
                    backgroundColor={palette.solidGrey}
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
                    backgroundColor={palette.solidGrey}
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
              <Controller
                control={control}
                name='amount'
                rules={{
                  validate: commaValidation,
                }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'prospectScreen.process.amount'}
                    error={!!errors.amount}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.amount?.message}
                    backgroundColor={palette.solidGrey}
                  />
                )}
              />
            </View>
            {prospect.status === ProspectStatus.TO_CONTACT ? (
              <View style={{ flex: 1, paddingTop: spacing[4] }}>
                <TouchableOpacity style={current === ProspectEnum.INTERESTED ? CHECKED : UNCHECKED} onPress={() => setCurrent(ProspectEnum.INTERESTED)}>
                  <RadioButton isActive={current === ProspectEnum.INTERESTED} />
                  <Text tx={'prospectScreen.process.interested'} style={current === ProspectEnum.INTERESTED ? CHECKED_TEXT : UNCHECKED_TEXT} />
                </TouchableOpacity>
                <TouchableOpacity style={current === ProspectEnum.NOT_INTERESTED ? CHECKED : UNCHECKED} onPress={() => setCurrent(ProspectEnum.NOT_INTERESTED)}>
                  <RadioButton isActive={current === ProspectEnum.NOT_INTERESTED} />
                  <Text tx={'prospectScreen.process.notInterested'} style={current === ProspectEnum.NOT_INTERESTED ? CHECKED_TEXT : UNCHECKED_TEXT} />
                </TouchableOpacity>
                <TouchableOpacity style={current === ProspectEnum.QUOTATION_SENT ? CHECKED : UNCHECKED} onPress={() => setCurrent(ProspectEnum.QUOTATION_SENT)}>
                  <RadioButton isActive={current === ProspectEnum.QUOTATION_SENT} />
                  <Text tx={'prospectScreen.process.quotationSent'} style={current === ProspectEnum.QUOTATION_SENT ? CHECKED_TEXT : UNCHECKED_TEXT} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flex: 1, paddingTop: spacing[4] }}>
                <TouchableOpacity
                  style={current === ProspectEnum.ACCEPTED_QUOTATION ? CHECKED : UNCHECKED}
                  onPress={() => setCurrent(ProspectEnum.ACCEPTED_QUOTATION)}
                >
                  <RadioButton isActive={current === ProspectEnum.ACCEPTED_QUOTATION} />
                  <Text tx={'prospectScreen.process.acceptedQuotation'} style={current === ProspectEnum.ACCEPTED_QUOTATION ? CHECKED_TEXT : UNCHECKED_TEXT} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={current === ProspectEnum.REFUSED_QUOTATION ? CHECKED : UNCHECKED}
                  onPress={() => setCurrent(ProspectEnum.REFUSED_QUOTATION)}
                >
                  <RadioButton isActive={current === ProspectEnum.REFUSED_QUOTATION} />
                  <Text tx={'prospectScreen.process.refusedQuotation'} style={current === ProspectEnum.REFUSED_QUOTATION ? CHECKED_TEXT : UNCHECKED_TEXT} />
                </TouchableOpacity>
                <TouchableOpacity style={current === ProspectEnum.INVOICE_SENT ? CHECKED : UNCHECKED} onPress={() => setCurrent(ProspectEnum.INVOICE_SENT)}>
                  <RadioButton isActive={current === ProspectEnum.INVOICE_SENT} />
                  <Text tx={'prospectScreen.process.invoiceSent'} style={current === ProspectEnum.INVOICE_SENT ? CHECKED_TEXT : UNCHECKED_TEXT} />
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
              width: 100,
              height: 40,
              marginRight: spacing[2],
            }}
            onPress={() => {
              currentPage === 1 ? closeModal() : setCurrentPage(1);
            }}
            textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }}
          />
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
        </View>
      </View>
    </Modal>
  );
};
