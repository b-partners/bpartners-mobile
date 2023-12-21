import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { BpPagination, Button, Text } from '../../../components';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

type IbanModalProps = {
  ibanModal: boolean;
  setIbanModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const IbanModal: React.FC<IbanModalProps> = props => {
  const { ibanModal, setIbanModal } = props;

  const [currentPage, setCurrentPage] = useState(1);

  const closeShareModal = () => {
    setCurrentPage(1);
    setIbanModal(false);
  };

  return (
    <Modal visible={ibanModal} onDismiss={closeShareModal}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(16,16,19,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        }}
      >
        <View style={{ width: '90%', backgroundColor: 'white', marginHorizontal: '5%', borderRadius: 20 }}>
          <View
            style={{
              width: '100%',
              height: 60,
              backgroundColor: palette.pastelRed,
              alignSelf: 'center',
              justifyContent: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Text tx={'errors.oops'} style={{ alignSelf: 'center', color: palette.white, fontSize: 20 }} />
            <Button
              onPress={() => {
                setIbanModal(false);
              }}
              style={{
                backgroundColor: palette.white,
                position: 'absolute',
                right: 10,
              }}
              textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
            >
              <CloseIcon name='close' size={25} color={palette.black} />
            </Button>
          </View>
          {currentPage === 1 ? (
            <View
              style={{
                width: '100%',
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: spacing[5],
                flexDirection: 'row',
              }}
            >
              <View style={{ width: '15%', justifyContent: 'center', alignContent: 'center' }}>
                <MaterialIcon name='error' size={50} color={palette.pastelRed} />
              </View>
              <View style={{ width: '85%' }}>
                <Text tx={'errors.paymentInitiation'} style={{ alignSelf: 'center', color: palette.pastelRed }} />
              </View>
            </View>
          ) : currentPage === 2 ? (
            <View
              style={{
                width: '100%',
                height: 100,
                justifyContent: 'center',
                alignSelf: 'center',
                paddingVertical: spacing[6],
                flexDirection: 'row',
                paddingLeft: 20,
              }}
            >
              <Text tx={'errors.paymentInitM1'} style={{ color: 'black' }} />
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                height: 100,
                justifyContent: 'center',
                alignSelf: 'center',
                paddingHorizontal: spacing[2],
              }}
            >
              <Text tx={'errors.paymentInitM2'} style={{ alignSelf: 'center', color: 'black' }} />
              <Text tx={'errors.phoneNumber'} style={{ alignSelf: 'center', color: 'black' }} />
            </View>
          )}
          <View
            style={{
              width: '100%',
              height: 60,
              alignSelf: 'center',
              justifyContent: 'center',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <BpPagination maxPage={3} page={currentPage} setPage={setCurrentPage} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
