import React from 'react';
import { Modal, View } from 'react-native';
import {palette} from "../../../../theme/palette";
import {Header} from "../../../../components";
import {CustomerCreationForm} from "./customer-creation-form";

type ShareModalProps = {
    creationModal: boolean;
    setCreationModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CustomerCreationModal: React.FC<ShareModalProps> = props => {
    const { creationModal, setCreationModal } = props;

    const closeShareModal = () => {
        setCreationModal(false);
    };

    return (
        <Modal animationType='slide' transparent={true} visible={creationModal} onRequestClose={closeShareModal}>
            <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'flex-end', alignItems: 'center' }}>
                <View style={{ backgroundColor: palette.white, height: '90%', width: '100%', borderRadius: 20 }}>
                    <View>
                        <Header rightIcon='cross' onRightPress={closeShareModal} style={{ borderTopLeftRadius: 50 }} headerTx='invoiceFormScreen.customerSelectionForm.addClient' />
                    </View>
                    <View>
                        <CustomerCreationForm/>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
