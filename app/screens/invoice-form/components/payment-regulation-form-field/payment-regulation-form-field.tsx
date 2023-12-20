import {
  Button,
  Icon,
  /*Button, Icon,*/
  Text,
} from '../../../../components';
import { translate } from '../../../../i18n';
import { PaymentRegulation } from '../../../../models/entities/payment-regulation/payment-regulation';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { amountToMajors } from '../../../../utils/money';
import { MaterialIcons } from '@expo/vector-icons';
import { Observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';

type PaymentRegulationFormFieldProps = {
  index: number;
  item: PaymentRegulation;
  onDeleteItem: (paymentRegulations: PaymentRegulation, index: number, percent: number) => void;
  setCurrentPayment: React.Dispatch<React.SetStateAction<PaymentRegulation>>;
  paymentRemove: (index: number) => void;
  setTotalPercent: React.Dispatch<React.SetStateAction<number>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const PaymentRegulationFormField: React.FC<PaymentRegulationFormFieldProps> = props => {
  const { item, index, onDeleteItem, setCurrentPayment, setTotalPercent, setCurrentIndex } = props;

  return (
    <Observer>
      {() => (
        <View
          style={{
            paddingVertical: spacing[4],
            shadowColor: color.palette.secondaryColor,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
            backgroundColor: color.palette.white,
            zIndex: 10,
            borderRadius: 10,
            marginBottom: spacing[6],
          }}
        >
          <Button
            style={{
              flexDirection: 'row',
              backgroundColor: color.transparent,
              position: 'absolute',
              top: -10,
              right: -15,
            }}
            onPress={() => {
              onDeleteItem(item, index, item.percent);
            }}
          >
            <Text
              tx='invoiceFormScreen.productForm.delete'
              style={{
                color: color.palette.secondaryColor,
                fontFamily: 'Geometria',
                fontSize: 13,
                marginRight: spacing[1],
              }}
            />
            <Icon icon='trash' />
          </Button>
          <View style={{ flexDirection: 'row', width: '100%', height: 75, borderBottomWidth: 2, borderColor: palette.solidGrey, marginTop: spacing[4] }}>
            <View style={{ width: '20%', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
              <View style={{ width: 60, backgroundColor: palette.secondaryColor, height: 60, justifyContent: 'center', borderRadius: 100 }}>
                <Text
                  text={`${amountToMajors(item.percent)}%`}
                  style={{
                    backgroundColor: palette.secondaryColor,
                    borderRadius: 5,
                    fontFamily: 'Geometria-Bold',
                    fontSize: 16,
                    textTransform: 'uppercase',
                    alignSelf: 'center',
                    color: palette.white,
                  }}
                />
              </View>
            </View>
            <View style={{ width: '60%', backgroundColor: palette.white, height: 60, justifyContent: 'center', paddingTop: spacing[3] }}>
              <Text
                text={`${translate('invoiceFormScreen.invoiceForm.toBePaid')} ${item.maturityDate}`}
                style={{
                  borderRadius: 5,
                  fontFamily: 'Geometria-Bold',
                  fontSize: 14,
                  textTransform: 'uppercase',
                  alignSelf: 'center',
                  color: palette.greyDarker,
                }}
              />
            </View>
            <View style={{ width: '20%', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
              <MaterialIcons
                name='edit'
                size={30}
                color={palette.secondaryColor}
                onPress={async () => {
                  setTotalPercent(prevState => prevState - item.percent);
                  setCurrentIndex(index);
                  setCurrentPayment(item);
                }}
              />
            </View>
          </View>
          <View style={{ width: '100%', height: 75, justifyContent: 'center' }}>
            <Text
              text={item.comment === '' || item.comment === null ? translate('common.noComment') : item.comment}
              style={{
                borderRadius: 5,
                fontFamily: 'Geometria-Bold',
                fontSize: 14,
                textTransform: 'uppercase',
                alignSelf: 'center',
                color: palette.greyDarker,
              }}
            />
          </View>
        </View>
      )}
    </Observer>
  );
};
