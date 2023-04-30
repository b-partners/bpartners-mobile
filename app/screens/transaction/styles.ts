import { TextStyle, ViewStyle } from 'react-native';

import { TransactionType } from '../../models/entities/transaction-category/transaction-category';
import { color, spacing } from '../../theme';

export const TRANSACTION_AMOUNT = (transactionType: TransactionType): TextStyle => ({
  fontSize: 19,
  fontWeight: 'bold',
  color: transactionType === TransactionType.INCOME ? color.palette.green : color.palette.angry,
  textAlign: 'right',
});
export const LIST_TEXT: TextStyle = {
  fontWeight: 'bold',
};
export const LIST_CONTAINER: ViewStyle = {
  flexDirection: 'column',
  paddingVertical: spacing[2],
  marginTop: spacing[2],
};
export const TRANSACTION_LEFT_SIDE: ViewStyle = {
  flex: 2,
};
export const TRANSACTION_RIGHT_SIDE: ViewStyle = {
  flex: 1,
  marginLeft: 'auto',
};
export const TRANSACTION_ACTIONS: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  padding: spacing[0],
  position: 'relative',
};
export const DROPDOWN_PICKER_STYLE: ViewStyle = { flex: 1 };
export const ICON_STYLE = { flex: 1, marginHorizontal: spacing[1] };
export const TRANSACTION_DETAILS_STYLE: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  paddingHorizontal: spacing[2],
};

export const ICON_CONTAINER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' };
export const TRANSACTION_BOTTOM_SIDE: ViewStyle = { flex: 1, display: 'flex', width: '100%' };
