import React from 'react';
import { Modal, View } from 'react-native';
import Mailer from 'react-native-mail';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Button, Text } from '../../../components';
import { translate } from '../../../i18n';
import { AccountHolder } from '../../../models/entities/account-holder/account-holder';
import { Customer } from '../../../models/entities/customer/customer';
import { User } from '../../../models/entities/user/user';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';

type InvoiceCreationModalProps = {
  confirmationModal: boolean;
  setConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  customer: Customer;
  accountHolder: AccountHolder;
  user: User;
  setSendingRequest: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SendingConfirmationModal: React.FC<InvoiceCreationModalProps> = props => {
  const { confirmationModal, setConfirmationModal, customer, accountHolder, user, setSendingRequest } = props;

  const openMailApp = () => {
    const recipient = customer.email;
    const subject = `${accountHolder?.name} - Donnez nous votre avis`;
    const message = `<p>Cher(e) ${customer?.firstName} ${customer?.lastName},<br/><br/>
Nous espérons que vous allez bien. Nous vous remercions encore une fois d'avoir choisi ${accountHolder?.name}.
Nous espérons que vous avez été satisfait de notre travail et que nous avons répondu à vos attentes.<br/>
Nous aimerions vous demander si vous seriez prêt(e) à laisser un avis  à propos de votre expérience avec notre entreprise.
Nous attachons une grande importance aux avis de nos clients car ils nous aident à améliorer nos services et à offrir une meilleure expérience à l'avenir. 
Si vous avez 1 minute à nous accorder, voici le lien direct vers notre page de recueil d’avis où vous pouvez laisser un avis : 
<a href="${accountHolder?.feedback?.feedbackLink ?? ''}">${accountHolder?.feedback?.feedbackLink ?? ''}</a>.<br/><br/>
Nous vous remercions par avance pour votre temps et votre avis. 
N'hésitez pas à nous contacter si vous avez des questions ou des préoccupations.<br/><br/>
Cordialement,<br/>
${accountHolder?.name}<br/>
${user?.phone}</p>`;

    const email = {
      subject: subject,
      body: message,
      isHTML: true,
      recipients: [recipient],
    };

    Mailer.mail(email, error => {
      if (error) {
        showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      }
    });
    setSendingRequest(false);
  };

  return (
    <Modal animationType='slide' transparent={true} visible={confirmationModal} onRequestClose={() => setConfirmationModal(false)}>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(16,16,19,0.9)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: palette.white, height: '25%', width: '90%', borderRadius: 15 }}>
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
              tx='invoiceScreen.labels.requestTitle'
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
            <View style={{ width: '100%', height: '70%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Text
                tx='invoiceScreen.labels.sendRequest'
                style={{
                  color: palette.greyDarker,
                  marginRight: spacing[2],
                  fontFamily: 'Geometria',
                  marginBottom: spacing[1],
                }}
              />
              <Text
                text={`${customer?.firstName} ${customer?.lastName}`}
                style={{
                  color: palette.greyDarker,
                  marginRight: spacing[2],
                  fontFamily: 'Geometria',
                }}
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
