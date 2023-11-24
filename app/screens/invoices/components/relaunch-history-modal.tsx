import React from 'react';
import { Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';

import { Button, Text } from '../../../components';
import { translate } from '../../../i18n';
import { palette } from '../../../theme/palette';
import {
  MODAL_HEADER_BUTTON_STYLE,
  MODAL_HEADER_BUTTON_TEXT_STYLE,
  MODAL_HEADER_STYLE,
  MODAL_HEADER_TEXT_STYLE,
  MODAL_STYLE,
  relaunchHistoryModalStyles as styles,
} from '../utils/styles';
import { RelaunchHistoryProps } from '../utils/utils';

export const RelaunchHistoryModal = (props: RelaunchHistoryProps) => {
  const { isOpen, setOpen, item } = props;

  return (
    <Modal visible={isOpen} transparent={true} onDismiss={() => setOpen(false)}>
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
            <Text text={`${translate('invoicePreviewScreen.quotation')} : (${item.ref})`} style={styles.reference} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
