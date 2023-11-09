import React, { useState } from 'react';
import { Modal, View } from 'react-native';

import { Header } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { palette } from '../../../theme/palette';
import { ModalProps } from '../../invoice-form/components/utils';
import { CustomerCreationForm } from './customer-creation-form';

export const CustomerCreationModal: React.FC<ModalProps> = props => {
  const { visibleModal, setVisibleModal } = props;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const closeShareModal = () => {
    setVisibleModal(false);
  };

  return (
    <KeyboardLayout setKeyboardOpen={setIsKeyboardOpen}>
      <Modal animationType='slide' transparent={true} visible={visibleModal} onRequestClose={closeShareModal}>
        <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'flex-end', alignItems: 'center' }}>
          <View style={{ backgroundColor: palette.white, height: '100%', width: '100%' }}>
            {!isKeyboardOpen && (
              <Header
                rightIcon='cross'
                onRightPress={closeShareModal}
                style={{ borderTopLeftRadius: 50 }}
                headerTx='invoiceFormScreen.customerSelectionForm.addClient'
              />
            )}
            <View style={{ width: '100%', height: '100%' }}>
              <CustomerCreationForm setVisibleModal={setVisibleModal} isKeyboardOpen={isKeyboardOpen} />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardLayout>
  );
};
