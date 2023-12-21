import React, { useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Button, Dropdown, Loader, Text } from '../../../components';
import { translate } from '../../../i18n';
import { PaymentMethodModel } from '../../../models/entities/invoice/invoice';
import { color } from '../../../theme';
import { palette } from '../../../theme/palette';
import { formatDate } from '../../../utils/format-date';
import { printCurrency } from '../../../utils/money';
import { transactionStyles } from '../../transaction/utils/styles';
import {
  LOADER_STYLE,
  MODAL_HEADER_BUTTON_STYLE,
  MODAL_HEADER_BUTTON_TEXT_STYLE,
  MODAL_HEADER_STYLE,
  MODAL_HEADER_TEXT_STYLE,
  MODAL_STYLE,
  partialPaymentStyles as styles,
} from '../utils/styles';
import { PartialPaymentProps, paymentMethods } from '../utils/utils';

export const PartialPaymentModal = (props: PartialPaymentProps) => {
  const { isOpen, setOpen, updateStatus, isLoading, item } = props;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodModel>(paymentMethods[0]);

  return (
    <Modal visible={isOpen} transparent={true} onDismiss={() => setOpen(false)}>
      <View style={MODAL_STYLE}>
        <View style={styles.modalContainer}>
          <View style={MODAL_HEADER_STYLE}>
            <Text text={`${translate('invoiceFormScreen.invoiceForm.downPayment')} (${item.paymentRegulations.length})`} style={MODAL_HEADER_TEXT_STYLE} />
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
          <ScrollView
            style={{ height: '90%', width: '100%', marginVertical: '5%' }}
            contentContainerStyle={{ flexDirection: 'column' }}
            showsHorizontalScrollIndicator={false}
          >
            {item.paymentRegulations.map(paymentRegulation => (
              <View style={styles.body} key={paymentRegulation.paymentRequest.id}>
                <View style={styles.infosContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      width: 70,
                      height: 25,
                      top: 0,
                      left: -15,
                      transform: [{ rotate: '-35deg' }],
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 10,
                    }}
                  >
                    {paymentRegulation.status.paymentStatus === 'UNPAID' ? (
                      <Text text={'A payer'} style={{ fontFamily: 'Geometria', color: palette.saffron, fontSize: 15, fontWeight: 'bold' }} />
                    ) : (
                      <Text text={'Payée'} style={{ fontFamily: 'Geometria-Bold', color: palette.apple, fontSize: 16, fontWeight: 'bold' }} />
                    )}
                  </View>
                  <View style={styles.titleContainer}>
                    <Text text={paymentRegulation.paymentRequest.label} style={styles.text} />
                  </View>
                  <View style={styles.labelContainer}>
                    <Text text={printCurrency(paymentRegulation.paymentRequest.amount)} style={styles.text} />
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  {paymentRegulation.status.paymentStatus === 'UNPAID' ? (
                    <>
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
                          updateStatus(item.id, paymentRegulation.paymentRequest.id, selectedMethod.value);
                        }}
                        style={styles.button}
                      >
                        {isLoading ? (
                          <Loader size={20} containerStyle={LOADER_STYLE} color={palette.white} />
                        ) : (
                          <>
                            <SimpleLineIcons name='check-all' size={20} color='white' />
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <View style={{ height: 45, justifyContent: 'center', alignItems: 'center', width: '90%' }}>
                      <Text
                        text={`Payée le: ${formatDate(paymentRegulation.status.updatedAt)}`}
                        style={{ color: palette.lightGrey, fontFamily: 'Geometria' }}
                      />
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
