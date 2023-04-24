import React from 'react';
import { Modal, View } from 'react-native';

import {Button, Text} from "../../components";
import {spacing} from "../../theme";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {palette} from "../../theme/palette";

type InvoiceCreationModalProps = {
  confirmationModal: boolean;
  setConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: any;
  onSubmit: (invoices: any) => Promise<void>;
};

export const InvoiceCreationModal: React.FC<InvoiceCreationModalProps> = props => {
  const { confirmationModal, setConfirmationModal, handleSubmit, onSubmit } = props;

  return (
      <Modal animationType='slide' transparent={true} visible={confirmationModal} onRequestClose={() => setConfirmationModal(false)}>
        <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: palette.white, height: '35%', width: '90%', borderRadius: 15 }}>
            <View
                style={{
                  width: '100%',
                  height: '25%',
                  borderBottomWidth: 1,
                  borderBottomColor: palette.secondaryColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
            >
              <Text tx={'invoiceFormScreen.invoiceForm.save'} style={{ color: palette.secondaryColor, fontFamily: 'Geometria', fontSize: 18 }} />
            </View>
            <View style={{ width: '100%', height: '75%', flexDirection: 'column' }}>
              <View style={{ width: '100%', height: '45%', justifyContent: 'center' }}>
                <Button
                    onPress={handleSubmit(onSubmit)}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: palette.green,
                      borderRadius: 25,
                      paddingVertical: spacing[2],
                      marginHorizontal: spacing[6],
                      height: 45,
                    }}
                >
                  <>
                    <Text
                        tx='common.submit'
                        style={{
                          color: palette.white,
                          marginRight: spacing[2],
                          fontFamily: 'Geometria',
                        }}
                    />
                    <SimpleLineIcons name='check' size={20} color='white' />
                  </>
                </Button>
              </View>
              <View style={{ width: '100%', height: '10%', justifyContent: 'center', alignItems: 'center' }}>
                <Text tx={'common.or'} style={{ color: palette.secondaryColor, fontFamily: 'Geometria' }} />
              </View>
              <View style={{ width: '100%', height: '45%', justifyContent: 'center' }}>
                <Button
                    onPress={() => {
                      setConfirmationModal(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: palette.pastelRed,
                      borderRadius: 25,
                      paddingVertical: spacing[2],
                      marginHorizontal: spacing[6],
                      height: 45,
                    }}
                >
                  <Text
                      tx='common.cancel'
                      style={{
                        color: palette.white,
                        marginRight: spacing[2],
                        fontFamily: 'Geometria',
                      }}
                  />
                  <SimpleLineIcons name='close' size={20} color='white' />
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
  );
};
