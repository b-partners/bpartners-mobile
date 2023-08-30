import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Button, Dropdown, Loader, Text } from '../../../components';
import { translate } from '../../../i18n';
import { PaymentMethod, PaymentMethodModel } from '../../../models/entities/invoice/invoice';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { transactionStyles as styles } from '../../transaction/utils/styles';
import { LOADER_STYLE } from '../styles';
import { paymentMethods } from '../utils/utils';

interface InputFieldProps {
  isLoading: boolean;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  markAsPaid: (method: PaymentMethod) => void;
}

export const PaymentMethodSelectionModal = (props: InputFieldProps) => {
  const { isOpen, setOpen, markAsPaid, isLoading } = props;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodModel>(paymentMethods[0]);

  return (
    <Modal visible={isOpen} transparent={true} onDismiss={() => setOpen(false)}>
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
              tx='invoiceScreen.labels.paymentMethod'
              style={{
                color: palette.secondaryColor,
                fontFamily: 'Geometria',
                fontSize: 18,
              }}
            />
            <Button
              onPress={() => {
                setOpen(false);
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
          <View style={{ flex: 1, flexDirection: 'column', paddingTop: spacing[2], justifyContent: 'center' }}>
            <Dropdown<PaymentMethodModel>
              items={paymentMethods}
              labelField='label'
              valueField='value'
              onChangeText={() => {}}
              onChange={method => setSelectedMethod(method)}
              placeholder={translate('transactionListScreen.transactionCategoryPlaceholder')}
              value={selectedMethod}
              dropdownContainerStyle={{ padding: 0, width: '90%', marginHorizontal: '5%', marginTop: spacing[2] }}
              style={{
                height: 40,
                backgroundColor: color.palette.white,
                borderRadius: 25,
                paddingHorizontal: spacing[4],
                shadowColor: palette.lightGrey,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
              selectedItemTextStyle={{ color: palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
              itemTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria' }}
              placeholderTextStyle={{ color: color.palette.textClassicColor, fontFamily: 'Geometria-Bold' }}
            >
              <View testID='transaction-category-container' style={styles.dropdownChildren}>
                <Text
                  text={selectedMethod.label}
                  testID='transaction-category'
                  numberOfLines={2}
                  style={{
                    color: palette.lightGrey,
                    fontFamily: 'Geometria-Bold',
                    fontSize: 16,
                  }}
                />
                <Ionicons name='chevron-down-sharp' size={17} style={{ color: palette.lightGrey }} />
              </View>
            </Dropdown>
            <Button
              onPress={() => {
                markAsPaid(selectedMethod.value);
              }}
              style={{
                position: 'absolute',
                bottom: 5,
                flexDirection: 'row',
                backgroundColor: palette.green,
                borderRadius: 25,
                paddingVertical: spacing[2],
                marginHorizontal: '10%',
                height: 45,
                width: '80%',
              }}
            >
              {isLoading ? (
                <Loader size={10} containerStyle={LOADER_STYLE} color={palette.white} />
              ) : (
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
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
