import React, { useState } from 'react';
import { View } from 'react-native';
import { Modal } from 'react-native-paper';

type BankModalProps = {
  confirmationModal: boolean;
  setConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BankEditionModal: React.FC<BankModalProps> = props => {
  const { confirmationModal, setConfirmationModal } = props;

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal
      visible={confirmationModal}
      onDismiss={() => setConfirmationModal(false)}
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View></View>
    </Modal>
  );
};
