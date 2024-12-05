import { StyleSheet } from 'react-native';

import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

export const AnnotatorLabelListStyle = StyleSheet.create({
  accordion: {
    width: 320,
    borderRadius: 10,
    borderColor: palette.lighterGrey,
    borderWidth: 1,
    marginVertical: spacing[2],
  },
  accordionTitle: { color: palette.secondaryColor },
});
