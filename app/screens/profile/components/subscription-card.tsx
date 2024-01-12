import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text } from '../../../components';
import { TxKeyPath } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

type SubscriptionCardProps = {
  iconName: string;
  iconColor: string;
  text: TxKeyPath;
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = props => {
  const { iconName, iconColor, text } = props;
  return (
    <View style={{ width: '100%', flexDirection: 'row', marginVertical: spacing[4] }}>
      <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcon name={iconName} size={26} color={iconColor} />
      </View>
      <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Geometria',
            color: palette.greyDarker,
            width: '100%',
          }}
          tx={text}
        />
      </View>
    </View>
  );
};
