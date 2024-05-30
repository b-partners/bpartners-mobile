import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, View } from 'react-native';
import { Modal } from 'react-native-paper';

import { Button, InputField, Loader } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { AccountInfos } from '../../../models/entities/account/account';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { SHADOW_STYLE } from '../../invoices/utils/styles';

type BankModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  accountInfo: AccountInfos;
  setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfos>>;
};

export const BankEditionModal: React.FC<BankModalProps> = props => {
  const { showModal, setShowModal, accountInfo, setAccountInfo } = props;

  const { authStore } = useStores();

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      iban: accountInfo?.iban,
      bic: accountInfo?.bic,
      name: accountInfo?.name,
    },
  });

  const onSubmit = async bankInfo => {
    setIsLoading(true);
    try {
      const updatedAccountList = await authStore.updateAccountInfos(bankInfo);
      setAccountInfo(updatedAccountList);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.yellow });

      throw e;
    } finally {
      setShowModal(false);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
      <Modal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: keyboardOpen ? 'flex-start' : 'center',
          marginTop: keyboardOpen ? spacing[6] : 0,
        }}
      >
        <View
          style={{
            backgroundColor: color.palette.white,
            borderRadius: 20,
            width: '94%',
            minWidth: '94%',
            height: 320,
          }}
        >
          <View style={{ height: '60%', padding: spacing[5] }}>
            <View style={{ marginBottom: 20, width: '100%' }}>
              <Controller
                control={control}
                name='name'
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'bankScreen.accountName'}
                    error={!!errors.iban}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.iban?.message}
                    backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 20, width: '100%' }}>
              <Controller
                control={control}
                name='bic'
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'bankScreen.bic'}
                    error={!!errors.bic}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.bic?.message}
                    backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                  />
                )}
              />
            </View>
            <View style={{ marginBottom: 20, width: '100%' }}>
              <Controller
                control={control}
                name='iban'
                defaultValue=''
                render={({ field: { onChange, value } }) => (
                  <InputField
                    labelTx={'bankScreen.iban'}
                    error={!!errors.iban}
                    value={value}
                    onChange={onChange}
                    errorMessage={errors.iban?.message}
                    backgroundColor={Platform.OS === 'ios' ? palette.solidGrey : palette.white}
                  />
                )}
              />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Button
                tx={'common.edit'}
                style={{
                  ...SHADOW_STYLE,
                  backgroundColor: palette.secondaryColor,
                  borderRadius: 20,
                  marginVertical: 7,
                  paddingVertical: spacing[3],
                  paddingHorizontal: spacing[2],
                  width: '100%',
                  height: 40,
                }}
                onPress={handleSubmit(onSubmit)}
                textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }}
              >
                {isLoading && <Loader size={20} color={palette.white} />}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardLayout>
  );
};
