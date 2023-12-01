import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { Button, Text } from '../../../components';
import { translate } from '../../../i18n';
import { InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { convertHTMLToPlainText } from '../../../utils/html-to-text';
import {
  MODAL_HEADER_BUTTON_STYLE,
  MODAL_HEADER_BUTTON_TEXT_STYLE,
  MODAL_HEADER_STYLE,
  MODAL_HEADER_TEXT_STYLE,
  MODAL_STYLE,
  relaunchMessageModalStyles as styles,
} from '../utils/styles';
import { RelaunchMessageProps } from '../utils/utils';

export const RelaunchMessageModal = (props: RelaunchMessageProps) => {
  const { isOpen, setOpen, item, invoice, setCurrentRelaunch } = props;

  const plainText = convertHTMLToPlainText(item.emailInfo.emailBody);
  const lines = plainText.split('\n');

  const onClose = () => {
    setCurrentRelaunch(undefined);
    setOpen(false);
  };

  return (
    <Modal visible={isOpen} transparent={true} onDismiss={onClose}>
      <View style={MODAL_STYLE}>
        <View style={styles.modalContainer}>
          <View style={MODAL_HEADER_STYLE}>
            <Text tx={'relaunchHistoryModal.title'} style={MODAL_HEADER_TEXT_STYLE} />
            <Button
              onPress={() => {
                setOpen(false);
              }}
              style={MODAL_HEADER_BUTTON_STYLE}
              textStyle={MODAL_HEADER_BUTTON_TEXT_STYLE}
            >
              <CloseIcon name='close' size={25} color={palette.secondaryColor} />
            </Button>
          </View>
          <View style={styles.referenceContainer}>
            <Text
              text={`${translate(invoice.status === InvoiceStatus.PROPOSAL ? 'invoicePreviewScreen.quotation' : 'invoicePreviewScreen.invoice')} : (${
                invoice.ref
              })`}
              style={styles.reference}
            />
          </View>
          <ScrollView
            style={{
              width: '100%',
              height: 200,
              marginVertical: spacing[4],
              paddingLeft: spacing[2],
            }}
          >
            <Text text={`${item.emailInfo.emailObject}`} style={styles.object} />
            {lines.map((line, index) => (
              <Text key={index} style={styles.reference}>
                {line}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
