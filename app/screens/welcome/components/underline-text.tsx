import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../../../components';
import { TxKeyPath } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

type UnderlineTextProps = {
  navigation: DrawerNavigationProp<any>;
  screen: string;
  description: TxKeyPath;
  text: TxKeyPath;
};
export const UnderlineText: React.FC<UnderlineTextProps> = props => {
  const { navigation, screen, description, text } = props;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing[2] }}>
      <Text
        tx={description}
        style={{
          fontFamily: 'Geometria',
          marginRight: spacing[1],
          textShadowColor: palette.greyDarker,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate(screen)}>
        <Text tx={text} style={{ fontFamily: 'Geometria-Bold', textDecorationLine: 'underline' }} />
      </TouchableOpacity>
    </View>
  );
};
