import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Button, Dropdown, Loader, Text } from '../../../components';
import { translate } from '../../../i18n';
import { PaymentMethodModel } from '../../../models/entities/invoice/invoice';
import { color } from '../../../theme';
import { palette } from '../../../theme/palette';
import { transactionStyles } from '../../transaction/utils/styles';
import {
  LOADER_STYLE,
  MODAL_CONTAINER_STYLE,
  MODAL_HEADER_BUTTON_STYLE,
  MODAL_HEADER_BUTTON_TEXT_STYLE,
  MODAL_HEADER_STYLE,
  MODAL_HEADER_TEXT_STYLE,
  MODAL_STYLE,
  paymentMethodSelectionStyles as styles,
} from '../utils/styles';
import { InputFieldProps, paymentMethods } from '../utils/utils';

export const PaymentMethodSelectionModal = (props: InputFieldProps) => {
  const { isOpen, setOpen, markAsPaid, isLoading } = props;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodModel>(paymentMethods[0]);

  return (
    <Modal visible={isOpen} transparent={true} onDismiss={() => setOpen(false)}>
      <View style={MODAL_STYLE}>
        <View style={MODAL_CONTAINER_STYLE}>
          <View style={MODAL_HEADER_STYLE}>
            <Text tx='invoiceScreen.labels.paymentMethod' style={MODAL_HEADER_TEXT_STYLE} />
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
          <View style={styles.body}>
            <Dropdown<PaymentMethodModel>
              items={paymentMethods}
              labelField='label'
              valueField='value'
              onChangeText={() => {}}
              onChange={method => setSelectedMethod(method)}
              placeholder={translate('transactionListScreen.transactionCategoryPlaceholder')}
              value={selectedMethod}
              dropdownContainerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              selectedItemTextStyle={{ color: palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
              itemTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria' }}
              placeholderTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
            >
              <View testID='transaction-category-container' style={transactionStyles.dropdownChildren}>
                <Text text={selectedMethod.label} testID='transaction-category' numberOfLines={2} style={styles.dropdownChildrenText} />
                <Ionicons name='chevron-down-sharp' size={17} color={palette.lightGrey} />
              </View>
            </Dropdown>
            <Button
              onPress={() => {
                markAsPaid(selectedMethod.value);
              }}
              style={styles.button}
            >
              {isLoading ? (
                <Loader size={20} containerStyle={LOADER_STYLE} color={palette.white} />
              ) : (
                <>
                  <Text tx='common.submit' style={styles.buttonText} />
                  <SimpleLineIcons name='check' size={20} color='white' />
                </>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
