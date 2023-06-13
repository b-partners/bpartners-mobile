import React from 'react';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { Button, Text } from '../../../components';
import { translate } from '../../../i18n';
import { palette } from '../../../theme/palette';

interface InputFieldProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}

export const CheckEmailModal = ({ isOpen, setOpen, email }: InputFieldProps) => {
  return (
    <Modal visible={isOpen} onDismiss={() => setOpen(false)} style={{ width: '100%', height: '100%' }}>
      <View
        style={{
          width: '90%',
          backgroundColor: palette.white,
          paddingBottom: 30,
          marginHorizontal: '5%',
          borderRadius: 20,
          height: 100,
          flexDirection: 'column',
        }}
      >
        <View
          style={{
            width: '100%',
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomWidth: 2,
            borderColor: palette.secondaryColor,
          }}
        >
          <Text tx={'registrationScreen.confirm'} style={{ color: palette.secondaryColor, fontFamily: 'Geometria', fontSize: 20 }} />
          <Button
            onPress={() => {
              setOpen(false);
            }}
            style={{
              backgroundColor: palette.white,
              position: 'absolute',
              right: 10,
            }}
            textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
          >
            <CloseIcon name='close' size={25} color={palette.secondaryColor} />
          </Button>
        </View>
        <View
          style={{
            justifyContent: 'center',
            width: '100%',
            height: 100,
            backgroundColor: palette.white,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: palette.secondaryColor }}>{`${translate('registrationScreen.checkEmail')} ${email}`}</Text>
        </View>
      </View>
    </Modal>
  );
};
