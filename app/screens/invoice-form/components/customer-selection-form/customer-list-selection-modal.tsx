import { Customer } from "../../../../models/entities/customer/customer";
import { Modal, View, ViewStyle } from "react-native";
import CustomerSelectionForm from "./customer-selection-form";
import React from "react";

const MODAL_ITEM_CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  backgroundColor: "rgba(10,16,69,0.8)"
};
type TUserListSelectionModal = { visible: boolean, onRequestClose: () => void, onValidate: (customer) => void, customers: Customer[] };

const CustomerListSelectionModal = (props: TUserListSelectionModal) => (
  <Modal visible={props.visible}
         transparent={true}
         onRequestClose={props.onRequestClose}
         onDismiss={props.onRequestClose}
  >
    ~
    <View style={MODAL_ITEM_CONTAINER_STYLE}>
      <CustomerSelectionForm
        onValidate={props.onValidate}
        customers={props.customers} />
    </View>
  </Modal>);

export default CustomerListSelectionModal;