import { ViewStyle } from 'react-native';

import { palette } from '../../theme/palette';

export const HEADER_STYLE: ViewStyle = {
    backgroundColor: palette.lighterGrey,
  width: '100%',
    height: 60,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

export const LEFT_STYLE: ViewStyle = {
  width: 50,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 0.5,
}

export const TEXT_HEADER_STYLE: ViewStyle = {
  width: '100%',
  height: '100%',
  flex: 3,
  alignItems: 'flex-start',
  justifyContent: 'center',
}

export const MARKET_LIST_STYLE: ViewStyle = {
  width: '100%',
  height: '80%',
}
