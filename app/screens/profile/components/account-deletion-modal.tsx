import React from 'react';
import { Linking, Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Button, Text } from '../../../components';
import { translate } from '../../../i18n';
import { Account } from '../../../models/entities/account/account';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';

type InvoiceCreationModalProps = {
  confirmationModal: boolean;
  setConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  account: Account;
};

export const AccountDeletionModal: React.FC<InvoiceCreationModalProps> = props => {
  const { confirmationModal, setConfirmationModal, account } = props;

  const openMailApp = () => {
    const recipient = 'contact@bpartners.app';
    const subject = '[Suppression de compte]';
    const body = translate('profileScreen.deleteMessage', { userId: account.id, username: account.name });

    const url = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
        }
      })
      .catch(err => console.error("Erreur lors de l'ouverture de l'application de messagerie :", err));
  };

  return (
    <Modal animationType='slide' transparent={true} visible={confirmationModal} onRequestClose={() => setConfirmationModal(false)}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: palette.white, height: '35%', width: '90%', borderRadius: 15 }}>
          <View
            style={{
              width: '100%',
              borderBottomWidth: 1,
              borderBottomColor: palette.secondaryColor,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: spacing[2],
              position: 'relative',
              height: 50,
            }}
          >
            <Text
              tx='profileScreen.delete'
              style={{
                color: palette.secondaryColor,
                fontFamily: 'Geometria',
                fontSize: 18,
              }}
            />
            <Button
              onPress={() => {
                setConfirmationModal(false);
              }}
              style={{
                backgroundColor: palette.white,
                position: 'absolute',
                right: 26,
              }}
              textStyle={{ fontSize: 14, fontFamily: 'Geometria-Bold' }}
            >
              <CloseIcon name='close' size={25} color={palette.secondaryColor} />
            </Button>
          </View>
          <View style={{ width: '100%', height: '75%', flexDirection: 'column' }}>
            <View style={{ width: '100%', height: '90%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Text
                tx='profileScreen.firstStep'
                style={{
                  color: palette.greyDarker,
                  width: '94%',
                  marginRight: spacing[2],
                  fontFamily: 'Geometria',
                }}
                numberOfLines={3}
              />
              <Text
                tx='profileScreen.secondStep'
                style={{
                  color: palette.greyDarker,
                  width: '94%',
                  marginRight: spacing[2],
                  fontFamily: 'Geometria',
                  marginTop: spacing[2],
                }}
                numberOfLines={5}
              />
            </View>
            <View style={{ width: '100%', height: '10%', justifyContent: 'center' }}>
              <Button
                onPress={openMailApp}
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
          </View>
        </View>
      </View>
    </Modal>
  );
};
