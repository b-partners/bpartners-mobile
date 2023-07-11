import { Observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components';
import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';
import { amountToMajors } from '../../../../utils/money';

type PaymentRegulationDraftFieldProps = {
  percent: number;
};

export const PaymentRegulationDraftField: React.FC<PaymentRegulationDraftFieldProps> = props => {
  const { percent } = props;

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
          <View style={{ flexDirection: 'row', width: '100%', height: 75, borderBottomWidth: 2, borderColor: palette.solidGrey, marginTop: spacing[4] }}>
            <View style={{ width: '20%', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
              <View style={{ width: 60, backgroundColor: palette.secondaryColor, height: 60, justifyContent: 'center', borderRadius: 100 }}>
                <Text
                  text={`${amountToMajors(10000 - percent)}%`}
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
                tx={'invoiceFormScreen.paymentRegulationForm.restToBePaid'}
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
