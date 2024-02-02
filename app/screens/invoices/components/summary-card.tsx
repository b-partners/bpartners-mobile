import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Loader, Text } from '../../../components';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors } from '../../../utils/money';
import { SummaryCardProps } from '../utils/utils';

export const SummaryCard: React.FC<SummaryCardProps> = props => {
  const { colors, space, icon, label, amount, loading } = props;

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{
        width: '30%',
        height: 60,
        marginHorizontal: space,
        borderRadius: 5,
        flexDirection: 'row',
      }}
    >
      <View style={{ width: '30%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
      <View style={{ width: '70%', height: '100%', flexDirection: 'column' }}>
        <View style={{ width: '100%', height: '50%', justifyContent: 'center', paddingLeft: '5%' }}>
          <Text tx={label} style={{ fontFamily: 'Geometria', color: palette.secondaryColor, fontSize: 10, fontWeight: 'bold' }} />
        </View>
        {loading ? (
          <Loader size={15} color={palette.secondaryColor} />
        ) : (
          <View style={{ height: '50%', width: '100%', paddingLeft: '5%' }}>
            {amount ? (
              <Text text={printCurrencyToMajors(amount)} style={{ fontFamily: 'Geometria', color: palette.secondaryColor, fontSize: 12 }} />
            ) : (
              <Text tx={'errors.unknown'} style={{ fontFamily: 'Geometria', color: palette.secondaryColor, fontSize: 12 }} />
            )}
          </View>
        )}
      </View>
    </LinearGradient>
  );
};
