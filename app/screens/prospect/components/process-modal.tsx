import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Modal } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import { Text } from '../../../components';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { ProcessModalProps } from '../utils/utils';

export const ProcessModal: React.FC<ProcessModalProps> = props => {
  const { showModal, setShowModal, prospect } = props;

  const closeModal = () => {
    setShowModal(false);
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
      </View>
    </Modal>
  );
};
