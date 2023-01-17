import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Text } from '../../../components';
import { TxKeyPath } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

type TGridHeaderContent = {
  headerText?: string;
  headerTx?: TxKeyPath;
  bodyText?: string;
  bodyTx?: TxKeyPath;
  style?: ViewStyle;
};
const HEADER_TEXT_STYlE: TextStyle = { color: palette.greyDarker, fontSize: 14, fontWeight: '700' };
const MAIN_CONTAINER: ViewStyle = { padding: spacing[4] };
const BODY_TEXT_STYLE: TextStyle = { color: palette.textClassicColor, fontSize: 18, fontWeight: '700' };

const GridHeaderContent: FC<TGridHeaderContent> = props => {
  const { headerText, headerTx, bodyText, bodyTx, style } = props;

  return (
    <View style={{ ...MAIN_CONTAINER, ...style }}>
      <Text text={headerText} tx={headerTx} style={HEADER_TEXT_STYlE} />
      <Text text={bodyText} tx={bodyTx} style={BODY_TEXT_STYLE} />
    </View>
  );
};

export default GridHeaderContent;
