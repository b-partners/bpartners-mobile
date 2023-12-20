import { Button, Text } from '../../../components';
import { translate } from '../../../i18n';
import { AccountHolder } from '../../../models/entities/account-holder/account-holder';
import { Customer } from '../../../models/entities/customer/customer';
import { User } from '../../../models/entities/user/user';
import { palette } from '../../../theme/palette';
import { showMessage } from '../../../utils/snackbar';
import {
  MODAL_CONTAINER_STYLE,
  MODAL_HEADER_BUTTON_STYLE,
  MODAL_HEADER_BUTTON_TEXT_STYLE,
  MODAL_HEADER_STYLE,
  MODAL_HEADER_TEXT_STYLE,
  MODAL_STYLE,
  sendingConfirmationModalStyles as styles,
} from '../utils/styles';
import React from 'react';
import { Modal, View } from 'react-native';
import Mailer from 'react-native-mail';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

type InvoiceCreationModalProps = {
  confirmationModal: boolean;
  setConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  customer: Customer;
  accountHolder: AccountHolder;
  user: User;
};

export const SendingConfirmationModal: React.FC<InvoiceCreationModalProps> = props => {
  const { confirmationModal, setConfirmationModal, customer, accountHolder, user } = props;

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
    setConfirmationModal(false);
  };

  return (
    <Modal animationType='slide' transparent={true} visible={confirmationModal} onRequestClose={() => setConfirmationModal(false)}>
      <View style={MODAL_STYLE}>
        <View style={MODAL_CONTAINER_STYLE}>
          <View style={MODAL_HEADER_STYLE}>
            <Text tx='invoiceScreen.labels.requestTitle' style={MODAL_HEADER_TEXT_STYLE} />
            <Button
              onPress={() => {
                setConfirmationModal(false);
              }}
              style={MODAL_HEADER_BUTTON_STYLE}
              textStyle={MODAL_HEADER_BUTTON_TEXT_STYLE}
            >
              <CloseIcon name='close' size={25} color={palette.secondaryColor} />
            </Button>
          </View>
          <View style={styles.body}>
            <View style={styles.labelContainer}>
              <Text tx='invoiceScreen.labels.sendRequest' style={styles.label} />
              <Text text={`${customer?.firstName} ${customer?.lastName}`} style={styles.customer} />
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={openMailApp} style={styles.button}>
                <>
                  <Text tx='common.submit' style={styles.buttonText} />
                  <SimpleLineIcons name='check' size={20} color={palette.white} />
                </>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
