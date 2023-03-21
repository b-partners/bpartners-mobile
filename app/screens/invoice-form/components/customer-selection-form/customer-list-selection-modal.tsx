import React, { FC } from 'react';
import { Modal, View, ViewStyle } from 'react-native';

import { Customer } from '../../../../models/entities/customer/customer';
import CustomerSelectionForm from './customer-selection-form';

const MODAL_ITEM_CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: 'rgba(10,16,69,0.8)',
};
type TUserListSelectionModal = {
  visible: boolean;
  onRequestClose: () => void;
  onValidateChoice?: (customer: Customer) => void;
  customers: Customer[];
  onDismiss?: () => void;
  setShowUserListModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomerListSelectionModal: FC<TUserListSelectionModal> = ({ customers, onRequestClose, onValidateChoice, onDismiss, visible , setShowUserListModal}) => {
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onRequestClose} onDismiss={onDismiss}>
      <View style={MODAL_ITEM_CONTAINER_STYLE}>
        <CustomerSelectionForm onValidateChoice={onValidateChoice} customers={customers} setShowUserListModal={setShowUserListModal}/>
      </View>
    </Modal>
  );
};

export default CustomerListSelectionModal;
