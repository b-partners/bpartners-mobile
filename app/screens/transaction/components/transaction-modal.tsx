import React from 'react';
import { Modal, View } from 'react-native';

import { Header } from '../../../components';
import { palette } from '../../../theme/palette';

type PaymentModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TransactionModal: React.FC<PaymentModalProps> = props => {
  const { showModal, setShowModal } = props;

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Modal testID='payment-url-modal' animationType='slide' transparent={true} visible={showModal} onRequestClose={closeModal}>
      <View style={{ flex: 1, backgroundColor: 'rgba(16,16,19,0.9)' }} />
      <View
        style={{
          display: 'flex',
          backgroundColor: palette.white,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          width: '100%',
          height: '100%',
        }}
        testID='payment-url-modal-container'
      >
        <View testID='payment-url-modal-title-container'>
          <Header rightIcon='cross' onRightPress={closeModal} style={{ borderTopLeftRadius: 50 }} headerTx='paymentInitiationScreen.fields.paymentUrl' />
        </View>
      </View>
    </Modal>
  );
};
