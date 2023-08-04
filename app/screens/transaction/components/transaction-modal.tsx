import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { AutoImage, Text } from '../../../components';
import { translate } from '../../../i18n';
import { TransactionType } from '../../../models/entities/transaction-category/transaction-category';
import { Transaction } from '../../../models/entities/transaction/transaction';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors } from '../../../utils/money';

type PaymentModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentTransaction: Transaction;
};

export const TransactionModal: React.FC<PaymentModalProps> = props => {
  const { currentTransaction, showModal, setShowModal } = props;

  const closeModal = () => {
    setShowModal(false);
  };
  const dateStr = currentTransaction.paymentDatetime;
  const dateObj = new Date(dateStr);
  const dateFormat = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Modal animationType='slide' transparent={true} visible={showModal} onRequestClose={closeModal} style={{ height: '100%', width: '100%' }}>
      <View
        style={{
          backgroundColor: palette.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          width: '100%',
          height: '85%',
          position: 'absolute',
          bottom: 0,
        }}
        testID='payment-url-modal-container'
      >
        <View style={{ width: '100%', flexDirection: 'column' }}>
          <AutoImage
            source={require('../utils/transaction.png')}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            resizeMethod='auto'
            resizeMode='stretch'
          />
          <View
            style={{
              width: '100%',
              height: 40,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <TouchableOpacity style={{ width: 50, height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowModal(false)}>
              <CloseIcon name='close' size={30} color={palette.black} />
            </TouchableOpacity>
          </View>
          <View style={{ width: '100%', height: 200 }}>
            <View style={{ width: '100%', height: '40%', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text
                text={currentTransaction.label}
                numberOfLines={3}
                style={{
                  color: color.palette.textClassicColor,
                  fontFamily: 'Geometria-Bold',
                  fontSize: 20,
                  textTransform: 'uppercase',
                  marginLeft: spacing[4],
                }}
              />
            </View>
            <View style={{ width: '100%', height: '20%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text
                  text={`Le ${dateFormat}`}
                  numberOfLines={1}
                  style={{
                    color: color.palette.lightGrey,
                    fontFamily: 'Geometria',
                    fontSize: 15,
                    marginLeft: spacing[4],
                  }}
                />
              </View>
              <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text
                  text={`${currentTransaction.type === TransactionType.OUTCOME ? '-' : '+'}${printCurrencyToMajors(currentTransaction.amount)}`}
                  numberOfLines={1}
                  style={{
                    color: color.palette.textClassicColor,
                    fontFamily: 'Geometria-Bold',
                    fontSize: 30,
                    marginRight: spacing[4],
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ width: '100%', height: 200, marginTop: spacing[4] }}>
          <View
            style={{
              height: 60,
              marginHorizontal: '5%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              tx={'transactionListScreen.reference'}
              style={{
                fontSize: 11,
                color: palette.lightGrey,
                fontFamily: 'Geometria-Bold',
                width: '100%',
                textTransform: 'uppercase',
                marginVertical: 5,
              }}
            />
            <Text
              text={currentTransaction.reference ?? translate('common.noInformation')}
              style={{
                width: '100%',
                fontSize: 15,
                color: palette.darkBlack,
                fontFamily: 'Geometria',
                marginVertical: 5,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
