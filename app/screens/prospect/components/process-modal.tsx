import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { InputField, Text } from '../../../components';
import { translate } from '../../../i18n';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { ProcessModalProps } from '../utils/utils';

export const ProcessModal: React.FC<ProcessModalProps> = props => {
  const { showModal, setShowModal, prospect } = props;

  const closeModal = () => {
    setShowModal(false);
  };

  const {
    handleSubmit,
    control,
    reset,
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
          height: '85%',
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
          <TouchableOpacity onPress={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AntDesignIcon name='close' color={color.palette.lightGrey} size={20} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[2] }}>
          <View style={{ marginBottom: 10, width: '100%' }}>
            <Controller
              control={control}
              name='email'
              rules={{
                required: translate('errors.required'),
              }}
              defaultValue=''
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'profileEditionScreen.companyInfo.socialCapital'}
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
              rules={{
                required: translate('errors.required'),
              }}
              defaultValue=''
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'profileEditionScreen.companyInfo.socialCapital'}
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
              rules={{
                required: translate('errors.required'),
              }}
              defaultValue=''
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'profileEditionScreen.companyInfo.socialCapital'}
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
              rules={{
                required: translate('errors.required'),
              }}
              defaultValue=''
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'profileEditionScreen.companyInfo.socialCapital'}
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
                  labelTx={'profileEditionScreen.companyInfo.socialCapital'}
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
      </View>
    </Modal>
  );
};
