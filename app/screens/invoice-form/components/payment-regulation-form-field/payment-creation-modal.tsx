import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { Button, Text } from '../../../../components';
import { DatePickerField } from '../../../../components/date-picker-field/date-picker-field';
import InputField from '../../../../components/input-field/input-field';
import { translate } from '../../../../i18n';
import { spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { amountToMinors } from '../../../../utils/money';
import { showMessage } from '../../../../utils/snackbar';
import { DATE_PICKER_LABEL_STYLE, DATE_PICKER_TEXT_STYLE } from '../utils';

type PaymentCreationModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  append: (data: any) => void;
  totalPercent: number;
  setTotalPercent: React.Dispatch<React.SetStateAction<number>>;
};

export const PaymentCreationModal: React.FC<PaymentCreationModalProps> = props => {
  const { open, setOpen, append, totalPercent, setTotalPercent } = props;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { percent: '', comment: '', maturityDate: new Date() },
  });

  const onClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async paymentRegulation => {
    try {
      const year = paymentRegulation.maturityDate.getFullYear().toString().padStart(4, '0');
      const month = (paymentRegulation.maturityDate.getMonth() + 1).toString().padStart(2, '0');
      const day = paymentRegulation.maturityDate.getDate().toString().padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      const payment = {
        maturityDate: formattedDate,
        comment: paymentRegulation.comment,
        percent: amountToMinors(paymentRegulation.percent),
        amount: null,
      };
      await append(payment);
      setTotalPercent(totalPercent + amountToMinors(paymentRegulation.percent));
      onClose();
    } catch {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
    }
  };

  const isNumber = value => {
    return !isNaN(parseFloat(value)) && isFinite(value) && Number.isInteger(parseFloat(value));
  };

  const isValidPercent = value => {
    return totalPercent + value * 100 <= 10000;
  };

  return (
    <Modal animationType='slide' transparent={true} visible={open} onRequestClose={onClose}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: palette.white, height: '45%', width: '90%', borderRadius: 15 }}>
          <View
            style={{
              width: '100%',
              borderBottomWidth: 1,
              borderBottomColor: palette.secondaryColor,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: spacing[2],
              position: 'relative',
              height: 50,
            }}
          >
            <Text
              tx='invoiceFormScreen.paymentRegulationForm.add'
              style={{
                color: palette.secondaryColor,
                fontFamily: 'Geometria',
                fontSize: 18,
              }}
            />
            <Button
              onPress={onClose}
              style={{
                backgroundColor: palette.white,
                position: 'absolute',
                right: 26,
              }}
              textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
            >
              <CloseIcon name='close' size={25} color={palette.secondaryColor} />
            </Button>
          </View>
          <View style={{ width: '100%', height: '75%', flexDirection: 'column' }}>
            <View style={{ width: '100%', height: '85%', justifyContent: 'center', marginVertical: '5%' }}>
              <View style={{ marginBottom: 10, width: '70%', marginHorizontal: '15%' }}>
                <Controller
                  control={control}
                  name='percent'
                  rules={{
                    required: translate('errors.required'),
                    validate: {
                      isNumber: value => isNumber(value) || translate('errors.invalidPercent'),
                      isValidPercent: value => isValidPercent(value) || translate('invoiceFormScreen.paymentRegulationForm.invalidPercent'),
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'invoiceFormScreen.paymentRegulationForm.percent'}
                      error={!!errors.percent}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.percent?.message}
                      backgroundColor={palette.lighterGrey}
                      rightRender={true}
                      rightText={'%'}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '70%', marginHorizontal: '15%', height: 65 }}>
                <Controller
                  control={control}
                  name='maturityDate'
                  rules={{
                    required: translate('errors.required'),
                  }}
                  render={({ field: { onChange, value } }) => (
                    <DatePickerField
                      labelTx='invoiceFormScreen.paymentRegulationForm.maturityDate'
                      isButtonPreset={false}
                      labelStyle={DATE_PICKER_LABEL_STYLE}
                      containerStyle={{
                        padding: spacing[4],
                        backgroundColor: palette.lighterGrey,
                        borderColor: '#E1E5EF',
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      textStyle={DATE_PICKER_TEXT_STYLE}
                      dateSeparator='/'
                      value={value}
                      onDateChange={onChange}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '70%', marginHorizontal: '15%' }}>
                <Controller
                  control={control}
                  name='comment'
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'invoiceFormScreen.paymentRegulationForm.comment'}
                      error={!!errors.comment}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.comment?.message}
                      backgroundColor={palette.lighterGrey}
                    />
                  )}
                />
              </View>
            </View>
            <View style={{ width: '100%', height: '10%', justifyContent: 'center' }}>
              {errors.percent ? (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: palette.solidGrey,
                    borderRadius: 25,
                    paddingVertical: spacing[2],
                    marginHorizontal: spacing[6],
                    height: 45,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <>
                    <Text
                      tx='common.create'
                      style={{
                        color: palette.lighterGrey,
                        marginRight: spacing[2],
                        fontFamily: 'Geometria',
                      }}
                    />
                    <MaterialIcons name='payments' size={20} color={palette.lighterGrey} />
                  </>
                </View>
              ) : (
                <Button
                  onPress={handleSubmit(onSubmit)}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: palette.secondaryColor,
                    borderRadius: 25,
                    paddingVertical: spacing[2],
                    marginHorizontal: spacing[6],
                    height: 45,
                  }}
                >
                  <>
                    <Text
                      tx='common.create'
                      style={{
                        color: palette.white,
                        marginRight: spacing[2],
                        fontFamily: 'Geometria',
                      }}
                    />
                    <MaterialIcons name='payments' size={20} color={palette.white} />
                  </>
                </Button>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
