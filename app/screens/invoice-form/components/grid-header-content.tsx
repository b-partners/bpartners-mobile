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
  headerTextStyle?: TextStyle;
  bodyTextStyle?: TextStyle;
};

const FONT_STYLE: TextStyle = {
  fontSize: 14,
  fontWeight: '700',
  fontFamily: 'Geometria',
};
const HEADER_TEXT_STYlE: TextStyle = { color: palette.greyDarker, ...FONT_STYLE };
const MAIN_CONTAINER: ViewStyle = { padding: spacing[4] };

const BODY_TEXT_STYLE: TextStyle = { color: palette.textClassicColor, ...FONT_STYLE };
const GridHeaderContent: FC<TGridHeaderContent> = props => {
  const { headerText, headerTx, bodyText, bodyTx, style, bodyTextStyle, headerTextStyle } = props;

  return (
    <View style={{ ...MAIN_CONTAINER, ...style }}>
      <Text text={headerText} tx={headerTx} style={[HEADER_TEXT_STYlE, bodyTextStyle, headerTextStyle]} />
      <Text text={bodyText} tx={bodyTx} style={[BODY_TEXT_STYLE, bodyTextStyle]} />
    </View>
  );
};

export default GridHeaderContent;
