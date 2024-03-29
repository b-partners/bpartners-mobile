import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, View } from 'react-native';

import { Header } from '../../../components';
import { KeyboardLayout } from '../../../components/keyboard-layout/KeyboardLayout';
import { palette } from '../../../theme/palette';
import { ProductModalType } from '../products-screen';
import { ProductForm } from './product-form';

type ProductModalProps = {
  modal: ProductModalType;
  setModal: Dispatch<SetStateAction<ProductModalType>>;
  isSubjectToVat: boolean;
};
export const ProductModal: React.FC<ProductModalProps> = props => {
  const { modal, setModal, isSubjectToVat } = props;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const closeModal = () => {
    setModal({
      type: 'CREATION',
      state: false,
      product: null,
    });
  };

  return (
    <KeyboardLayout setKeyboardOpen={setIsKeyboardOpen}>
      <Modal animationType='slide' transparent={true} visible={modal?.state} onRequestClose={closeModal}>
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(16,16,19,0.9)',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <View style={{ backgroundColor: palette.white, height: '100%', width: '100%' }}>
            {!isKeyboardOpen && (
              <Header
                rightIcon='cross'
                onRightPress={closeModal}
                style={{ borderTopLeftRadius: 50 }}
                headerTx={modal?.type === 'CREATION' ? 'invoiceFormScreen.productForm.addProduct' : 'invoiceFormScreen.productForm.editProduct'}
              />
            )}
            <View style={{ width: '100%', height: '100%' }}>
              <ProductForm modal={modal} setModal={setModal} isKeyboardOpen={isKeyboardOpen} isSubjectToVat={isSubjectToVat} />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardLayout>
  );
};
