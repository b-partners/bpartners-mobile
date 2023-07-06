import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Linking, Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Button, Text } from '../../../../components';
import InputField from '../../../../components/input-field/input-field';
import { translate } from '../../../../i18n';
import { CreateUser } from '../../../../models/entities/user/user';
import { spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { showMessage } from '../../../../utils/snackbar';

type PaymentCreationModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PaymentCreationModal: React.FC<PaymentCreationModalProps> = props => {
  const { open, setOpen } = props;

  const openMailApp = () => {
    const recipient = 'contact@bpartners.app';
    const subject = '[Suppresion de compte]';
    const body = translate('profileScreen.deleteMessage');

    const url = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
        }
      })
      .catch(err => console.error("Erreur lors de l'ouverture de l'application de messagerie :", err));
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: { percent: '', comment: '', maturityDate: '' },
  });

  return (
    <Modal animationType='slide' transparent={true} visible={open} onRequestClose={() => setOpen(false)}>
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
              onPress={() => {
                setOpen(false);
              }}
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
            <View style={{ width: '95%', height: '90%', justifyContent: 'center', alignContent: 'center' }}>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='percent'
                  rules={{
                    required: translate('errors.required'),
                  }}
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'invoiceFormScreen.paymentRegulationForm.percent'}
                      error={!!errors.percent}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.percent?.message}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='maturityDate'
                  rules={{
                    required: translate('errors.required'),
                  }}
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'invoiceFormScreen.paymentRegulationForm.maturityDate'}
                      error={!!errors.maturityDate}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.maturityDate?.message}
                    />
                  )}
                />
              </View>
              <View style={{ marginBottom: 10, width: '100%' }}>
                <Controller
                  control={control}
                  name='comment'
                  rules={{
                    required: translate('errors.required'),
                  }}
                  defaultValue=''
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      labelTx={'invoiceFormScreen.paymentRegulationForm.comment'}
                      error={!!errors.comment}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.comment?.message}
                    />
                  )}
                />
              </View>
            </View>
            <View style={{ width: '100%', height: '10%', justifyContent: 'center' }}>
              <Button
                onPress={openMailApp}
                style={{
                  flexDirection: 'row',
                  backgroundColor: palette.green,
                  borderRadius: 25,
                  paddingVertical: spacing[2],
                  marginHorizontal: spacing[6],
                  height: 45,
                }}
              >
                <>
                  <Text
                    tx='common.submit'
                    style={{
                      color: palette.white,
                      marginRight: spacing[2],
                      fontFamily: 'Geometria',
                    }}
                  />
                  <SimpleLineIcons name='check' size={20} color='white' />
                </>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
