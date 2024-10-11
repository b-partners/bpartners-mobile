import { StyleProp, ViewStyle } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const ProspectCreationStyle = {
  modal: (keyboardOpen: boolean): StyleProp<ViewStyle> => ({
    width: '100%',
    height: '100%',
    justifyContent: keyboardOpen ? 'flex-start' : 'center',
  }),
  scrollViewContainer: {
    backgroundColor: palette.white,
    borderRadius: 20,
    marginHorizontal: '2%',
    paddingVertical: spacing[2],
    width: '96%',
    height: 540,
  },
  headerContainer: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  } as StyleProp<ViewStyle>,
  headerTitleContainer: {
    height: '100%',
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing[4],
  } as StyleProp<ViewStyle>,
  headerTitle: { fontSize: 15, color: palette.secondaryColor },
  closeButton: { flex: 1, justifyContent: 'center', alignItems: 'center' } as StyleProp<ViewStyle>,
  actionContainer: {
    height: 60,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-end',
    paddingRight: spacing[4],
    alignItems: 'center',
    flexDirection: 'row',
  } as StyleProp<ViewStyle>,
};
