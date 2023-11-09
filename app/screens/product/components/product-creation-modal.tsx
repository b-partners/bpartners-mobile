import React from 'react';
import { Modal, View } from 'react-native';

import { Header } from '../../../components';
import { palette } from '../../../theme/palette';
import { ModalProps } from '../../invoice-form/components/utils';
import { ProductCreationForm } from './product-creation-form';

export const ProductCreationModal: React.FC<ModalProps> = props => {
  const { visibleModal, setVisibleModal } = props;

  const closeModal = () => {
    setVisibleModal(false);
  };

  return (
    <Modal animationType='slide' transparent={true} visible={visibleModal} onRequestClose={closeModal}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: palette.white, height: '80%', width: '100%' }}>
          <View style={{ width: '100%', height: '20%' }}>
            <Header
              rightIcon='cross'
              onRightPress={() => setVisibleModal(false)}
              style={{ borderTopLeftRadius: 50 }}
              headerTx='invoiceFormScreen.invoiceForm.addItem'
            />
          </View>
          <View style={{ width: '100%', height: '80%' }}>
            <ProductCreationForm setVisibleModal={setVisibleModal} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
