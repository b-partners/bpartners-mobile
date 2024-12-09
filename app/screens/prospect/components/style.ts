import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { prospectItemStyles } from '../utils/styles';

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
  headerTitle: { fontSize: 15, marginBottom: 20 },
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

export const prospectStatusModalStyle = StyleSheet.create({
  or: {
    color: palette.black,
    padding: spacing[2],
    textAlign: 'center',
  },
  title: {
    color: palette.black,
    marginVertical: spacing[3],
    textAlign: 'center',
  },
  container: { display: 'flex', flexDirection: 'column', gap: 5 },
  orContainer: { flexDirection: 'row', alignItems: 'center' },
  separator: { ...prospectItemStyles.separatorCommonStyle },
});
