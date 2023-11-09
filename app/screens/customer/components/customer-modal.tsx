import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, View } from 'react-native';

import { Header } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { palette } from '../../../theme/palette';
import { CustomerModalType } from '../customers-screen';
import { CustomerForm } from './customer-form';

type CustomerModalProps = {
  modal: CustomerModalType;
  setModal: Dispatch<SetStateAction<CustomerModalType>>;
};
export const CustomerModal: React.FC<CustomerModalProps> = props => {
  const { modal, setModal } = props;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const closeShareModal = () => {
    setModal({
      type: 'CREATION',
      state: false,
      customer: null,
    });
  };

  return (
    <KeyboardLayout setKeyboardOpen={setIsKeyboardOpen}>
      <Modal animationType='slide' transparent={true} visible={modal?.state} onRequestClose={closeShareModal}>
        <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'flex-end', alignItems: 'center' }}>
          <View style={{ backgroundColor: palette.white, height: '100%', width: '100%' }}>
            {!isKeyboardOpen && (
              <Header
                rightIcon='cross'
                onRightPress={closeShareModal}
                style={{ borderTopLeftRadius: 50 }}
                headerTx={
                  modal?.type === 'CREATION' ? 'invoiceFormScreen.customerSelectionForm.addClient' : 'invoiceFormScreen.customerSelectionForm.editClient'
                }
              />
            )}
            <View style={{ width: '100%', height: '100%' }}>
              <CustomerForm modal={modal} setModal={setModal} isKeyboardOpen={isKeyboardOpen} />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardLayout>
  );
};
