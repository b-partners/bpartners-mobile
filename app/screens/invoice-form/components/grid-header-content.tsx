import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { Text } from '../../../components';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

type TGridHeaderContent = {
  headerText: string;
  bodyText: string;
  style?: ViewStyle;
};

const GridHeaderContent: FC<TGridHeaderContent> = props => {
  const { headerText, bodyText, style } = props;
  return (
    <View style={{ padding: spacing[4], ...style }}>
      <Text text={headerText} style={{ color: palette.greyDarker, fontSize: 14, fontWeight: '700' }} />
      <Text text={bodyText} style={{ color: palette.textClassicColor, fontSize: 18, fontWeight: '700' }} />
    </View>
  );
};

export default GridHeaderContent;
