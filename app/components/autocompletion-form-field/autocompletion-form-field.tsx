import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { spacing } from '../../theme';

export interface AutocompletionFormFieldProps<T> {
  data: T[];
  value?: T;
  labelField: string;
  valueField: string;
  onChange: (value: T) => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  selectedTextStyle?: TextStyle;
}

const DROPDOWN_STYLE: ViewStyle = {
  height: 44,
  backgroundColor: '#fff',
  paddingHorizontal: spacing[2],
};
export const AutocompletionFormField = observer(<T extends { id: string }>(props: AutocompletionFormFieldProps<T>) => {
  const { data, style: styleOverrides, value, ...rest } = props;

  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    setDropdownItems(data);
  }, [data]);

  return <Dropdown search={true} data={dropdownItems} value={value} style={[DROPDOWN_STYLE, styleOverrides]} {...rest} />;
});
