import React, { FC } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Text } from '../../../components';
import RadioButton from '../../../components/radio-button/radio-button';
import { Account } from '../../../models/entities/account/account';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

type TAccountRow = {
  account: Account;
  onSelect: (account: Account) => void;
  isSelected?: boolean;
};
const ACCOUNT_NAME: TextStyle = {
  color: palette.textClassicColor,
  fontWeight: 'bold',
  fontSize: 18,
};
const CUSTOMER_ROW_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
};

const EDIT_BUTTON_STYLE: ViewStyle = { flex: 1, justifyContent: 'center', alignItems: 'flex-end' };
const CustomerRow: FC<TAccountRow> = props => {
  const { account, onSelect, isSelected } = props;
  return (
    <View style={{ ...CUSTOMER_ROW_CONTAINER, paddingVertical: spacing[2] }}>
      <TouchableOpacity style={CUSTOMER_ROW_CONTAINER} onPress={() => onSelect(account)}>
        <>
          <RadioButton isActive={isSelected} />
          <Text text={account?.name} style={{ ...ACCOUNT_NAME, marginLeft: spacing[2] }} numberOfLines={2} />
        </>
      </TouchableOpacity>
      <TouchableOpacity style={EDIT_BUTTON_STYLE}>{/*<Icon name={'pencil'} color={palette.greyDarker} size={20} />*/}</TouchableOpacity>
    </View>
  );
};

export default CustomerRow;
