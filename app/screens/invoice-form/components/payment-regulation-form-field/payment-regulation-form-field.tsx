import { Observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';

import {
  /*Button, Icon,*/
  Text,
} from '../../../../components';
import { translate } from '../../../../i18n';
import { PaymentRegulation } from '../../../../models/entities/payment-regulation/payment-regulation';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { amountToMajors } from '../../../../utils/money';

type PaymentRegulationFormFieldProps = {
  item: PaymentRegulation;
};

export const PaymentRegulationFormField: React.FC<PaymentRegulationFormFieldProps> = props => {
  const { item } = props;

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
            height: 150,
          }}
        >
          {/*<Button
            style={{
              flexDirection: "row",
              backgroundColor: color.transparent,
              position: "absolute",
              top: -10,
              right: -15
            }}
             onPress={() => {
              onDeleteItem(currentProduct, index);
            }}
          >
            <Text
              tx="invoiceFormScreen.productForm.delete"
              style={{
                color: color.palette.secondaryColor,
                fontFamily: "Geometria",
                fontSize: 13,
                marginRight: spacing[1]
              }}
            />
            <Icon icon="trash" />
          </Button>*/}
          <View style={{ flexDirection: 'row', width: '100%', height: 75, borderBottomWidth: 2, borderColor: palette.solidGrey }}>
            <View style={{ width: '20%', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
              <View style={{ width: 60, backgroundColor: palette.secondaryColor, height: 60, justifyContent: 'center', borderRadius: 100 }}>
                <Text
                  text={`${amountToMajors(item.paymentRequest.percentValue)}%`}
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
            <View style={{ width: '80%', backgroundColor: palette.white, height: 60, justifyContent: 'center', paddingTop: spacing[3] }}>
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
          </View>
          <View style={{ width: '100%', height: 75, justifyContent: 'center' }}>
            <Text
              tx={'common.noComment'}
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
