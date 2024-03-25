import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, ViewStyle } from 'react-native';
import { Modal } from 'react-native-paper';

import { Button, DatePickerField, Loader, Text } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import { DATE_PICKER_CONTAINER_STYLE, DATE_PICKER_LABEL_STYLE, DATE_PICKER_TEXT_STYLE } from '../../invoice-form/components/utils';
import { SHADOW_STYLE } from '../../invoices/utils/styles';
import { ExportModalProps } from '../utils/utils';

export const ExportAccountModal: React.FC<ExportModalProps> = props => {
  const { showModal, setShowModal } = props;

  const { transactionStore } = useStores();

  const [loading, setLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const {
    handleSubmit,
    control,
    formState: {},
  } = useForm({
    mode: 'all',
  });

  const onSubmit = async dateRange => {
    setLoading(true);
    try {
      await transactionStore.generateTransactionExportLink({ ...dateRange, transactionStatus: 'BOOKED' });
      showMessage(translate('common.addedOrUpdated'), { backgroundColor: palette.green });
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const BUTTON_STYLE: ViewStyle = {
    ...SHADOW_STYLE,
    backgroundColor: palette.secondaryColor,
    borderRadius: 10,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    width: '45%',
    height: 40,
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
            padding: '5%',
            width: '96%',
            height: 390,
          }}
        >
          <Text tx={'exportAccounting.title'} style={{ color: palette.black, fontSize: 20 }} />
          <Text tx={'exportAccounting.chooseTransactionPeriod'} style={{ color: palette.black, fontSize: 16, paddingVertical: spacing[4] }} />
          <View style={{ height: 180, display: 'flex', justifyContent: 'space-between' }}>
            <Controller
              control={control}
              name='from'
              defaultValue={new Date()}
              render={({ field: { onChange, value } }) => (
                <DatePickerField
                  labelTx='common.from'
                  isButtonPreset={false}
                  labelStyle={DATE_PICKER_LABEL_STYLE}
                  containerStyle={{ ...DATE_PICKER_CONTAINER_STYLE, maxHeight: 80 }}
                  textStyle={DATE_PICKER_TEXT_STYLE}
                  dateSeparator='/'
                  value={value}
                  onDateChange={onChange}
                  type={'datetime'}
                />
              )}
            />

            <Controller
              control={control}
              name='to'
              defaultValue={new Date()}
              render={({ field: { onChange, value } }) => (
                <DatePickerField
                  labelTx='common.to'
                  isButtonPreset={false}
                  labelStyle={DATE_PICKER_LABEL_STYLE}
                  containerStyle={{ ...DATE_PICKER_CONTAINER_STYLE, maxHeight: 80 }}
                  textStyle={DATE_PICKER_TEXT_STYLE}
                  dateSeparator='/'
                  value={value}
                  onDateChange={onChange}
                  type={'datetime'}
                />
              )}
            />
          </View>
          <View
            style={{
              marginVertical: spacing[5],
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button tx={'common.cancel'} style={BUTTON_STYLE} onPress={() => {}} textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }} />
            {loading ? (
              <View style={BUTTON_STYLE}>
                <Loader size={20} color={palette.white} />
              </View>
            ) : (
              <Button tx={'common.validate'} style={BUTTON_STYLE} onPress={handleSubmit(onSubmit)} textStyle={{ fontSize: 13, fontFamily: 'Geometria-Bold' }} />
            )}
          </View>
        </View>
      </Modal>
    </KeyboardLayout>
  );
};
