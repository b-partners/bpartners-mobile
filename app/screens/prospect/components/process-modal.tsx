import React from 'react';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';

import { palette } from '../../../theme/palette';
import { ProcessModalProps } from '../utils/utils';

export const ProcessModal: React.FC<ProcessModalProps> = props => {
  const { showModal, setShowModal } = props;

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
        <View style={{ width: '100%', flexDirection: 'column' }}></View>
      </View>
    </Modal>
  );
};
