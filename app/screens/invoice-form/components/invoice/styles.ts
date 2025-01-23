import { StyleSheet } from 'react-native';

import { palette } from '../../../../theme/palette';

export const InvoiceAnnotationRendererStyle = StyleSheet.create({
  annotationInfoContainer: {
    padding: 5,
  },
  annotationInfoTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: palette.black,
    fontWeight: 'bold',
  },
  annotationInfoItemTitle: {
    color: palette.lightGrey,
  },
  annotationInfoItemContent: {
    color: palette.black,
  },
  annotationInfoItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
});
