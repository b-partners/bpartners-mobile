import { StyleSheet } from 'react-native';

import { color, spacing } from '../../../../theme';
import { palette } from '../../../../theme/palette';

export const ProductFormFieldStyle = StyleSheet.create({
  container: {
    paddingVertical: spacing[4],
    shadowColor: color.palette.secondaryColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: color.palette.white,
    zIndex: 10,
    borderRadius: 10,
    marginBottom: spacing[6],
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: color.transparent,
    position: 'absolute',
    top: -10,
    right: -15,
  },
  deleteButtonText: {
    color: color.palette.secondaryColor,
    fontFamily: 'Geometria',
    fontSize: 13,
    marginRight: spacing[1],
  },
  addButtonContainer: { flexDirection: 'row', alignItems: 'center' },
  addButtonTouch: { flex: 1, height: 70, justifyContent: 'center', alignItems: 'center' },
  selectProductContainer: {
    marginRight: '2.5%',
    paddingHorizontal: spacing[3],
    marginVertical: spacing[4],
    width: '80%',
    borderWidth: 1,
    borderColor: '#E1E5EF',
    borderRadius: 25,
  },
  selectProductTouchLabel: {
    fontFamily: 'Geometria-Bold',
    fontSize: 15,
    textTransform: 'uppercase',
  },
  selectProductTouchInput: {
    fontFamily: 'Geometria-Bold',
    fontSize: 15,
    textTransform: 'uppercase',
  },
  selectProductTouchIcon: { justifyContent: 'center' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 16, 69, 0.5)',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    paddingHorizontal: spacing[4],
    backgroundColor: palette.white,
    width: '100%',
  },
  modalProgressBar: { marginTop: spacing[2] },
  modalCloseButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing[1],
    paddingTop: spacing[1],
    paddingHorizontal: spacing[2],
    height: '5%',
  },
  modalCloseButtonText: {
    color: color.palette.lightGrey,
    fontFamily: 'Geometria',
    fontSize: 15,
  },
  modalCloseButtonTouch: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalSearchBar: {
    backgroundColor: palette.solidGrey,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuSearchBarInput: { color: palette.black, alignSelf: 'center' },
  modalProductListContainer: { paddingVertical: spacing[2], height: '73%' },
  modalProductListItemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: spacing[2],
  },
  modalProductListItemTouch: {
    flex: 1,
    flexDirection: 'row',
  },
  modalProductListItemText: {
    color: palette.textClassicColor,
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: spacing[2],
  },
  modalProductListSeparator: { borderColor: palette.lighterGrey },
});
