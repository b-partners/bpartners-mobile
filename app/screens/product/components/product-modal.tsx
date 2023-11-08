import React, {Dispatch, SetStateAction} from 'react';
import { Modal, View } from 'react-native';

import { Header } from '../../../components';
import { palette } from '../../../theme/palette';
import { ModalProps } from '../../invoice-form/components/utils';
import { ProductForm } from './product-form';
import {ProductModalType} from "../products-screen";


type ProductModalProps = {
  modal: ProductModalType;
  setModal: Dispatch<SetStateAction<ProductModalType>>;
};
export const ProductModal: React.FC<ProductModalProps> = props => {
  const { modal, setModal } = props;

  const closeModal = () => {
    setModal({
      type: 'CREATION',
      state: false,
      product: null,
    });
  };

  return (
    <Modal animationType='slide' transparent={true} visible={modal?.state} onRequestClose={closeModal}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: palette.white, height: '80%', width: '100%' }}>
          <View style={{ width: '100%', height: '20%' }}>
            <Header
              rightIcon='cross'
              onRightPress={closeModal}
              style={{ borderTopLeftRadius: 50 }}
              headerTx='invoiceFormScreen.invoiceForm.addItem'
            />
          </View>
          <View style={{ width: '100%', height: '80%' }}>
            <ProductForm setModal={setModal} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
