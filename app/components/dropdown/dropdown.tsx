import React, { PropsWithChildren, useEffect, useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Dropdown as DropdownPicker } from 'react-native-element-dropdown';

import { translate } from '../../i18n';
import { color, spacing } from '../../theme';
import { showMessage } from '../../utils/snackbar';

interface DropdownProps<T> extends PropsWithChildren<any> {
  items: T[];
  value?: T;
  labelField: string;
  valueField: string;
  onChange: (item: T) => Promise<void>;
  onChangeText: (search: string) => void;
  style?: ViewStyle;
  itemTextStyle?: TextStyle;
  placeholderTextStyle?: TextStyle;
  placeholder?: string;
}

const STYLE: ViewStyle = { flex: 1 };
const ITEM_TEXT_STYLE: TextStyle = { color: color.palette.black };
const PLACEHOLDER_TEXT_STYLE: TextStyle = { color: color.palette.white };

export const Dropdown = <T extends object>(props: DropdownProps<T>) => {
  const {
    items,
    value,
    labelField,
    valueField,
    onChange,
    onChangeText,
    style: styleOverrides,
    itemTextStyle: itemTextStylesOverrides,
    placeholder,
    children,
  } = props;

  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    setEdit(!value);
  }, []);

  return (
    <View style={{ flex: 1, paddingVertical: spacing[2], paddingHorizontal: spacing[1] }}>
      {!edit && <TouchableOpacity onPress={() => setEdit(true)}>{children}</TouchableOpacity>}
      {edit && (
        <View>
          <DropdownPicker
            style={[STYLE, styleOverrides]}
            itemTextStyle={[ITEM_TEXT_STYLE, itemTextStylesOverrides]}
            data={items}
            value={value}
            labelField={labelField}
            valueField={valueField}
            onChange={async item => {
              console.tron.log({ item });
              try {
                await onChange(item);
              } catch (e) {
                __DEV__ && console.tron.log(e);
                showMessage(translate('errors.somethingWentWrong'));
                throw e;
              } finally {
                setEdit(false);
              }
            }}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderStyle={[PLACEHOLDER_TEXT_STYLE]}
          />
        </View>
      )}
    </View>
  );
};
