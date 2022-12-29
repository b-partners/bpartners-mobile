import React, { useEffect, useState } from 'react';
import { ViewStyle } from 'react-native';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';

import { spacing } from '../../theme';

const DEFAULT_MAX_VALUE = 30;

interface DropdownProps<T> {
  items: T[];
  value: T;
  selectLabel: (item: T) => any;
  selectValue: (item: T) => any;
  onSelectItem?: (item: T) => void;
  onChangeValue?: (item: ValueType) => void;
  max?: number;
  containerStyle?: ViewStyle;
}

const CONTAINER_STYLE: ViewStyle = { flex: 1, marginVertical: spacing[2] };
const DROPDOWN_LIST_STYLE: ViewStyle = { position: 'relative', top: 0 };

export const Dropdown = <T extends object>(props: DropdownProps<T>) => {
  const { items, selectValue, selectLabel, value, onChangeValue, onSelectItem, max } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [itemTypes, setItemTypes] = useState<Array<ItemType<ValueType>>>([]);
  const [dropdownValue, setDropdownValue] = useState();

  useEffect(() => {
    setItemTypes(items.map(item => ({ label: selectLabel(item), value: selectValue(item), raw: item })));
  }, [items, selectLabel, selectValue]);

  useEffect(() => {
    setDropdownValue(selectValue(value));
  }, [selectValue, value]);

  return (
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      items={itemTypes}
      value={dropdownValue}
      setValue={setDropdownValue}
      onSelectItem={item => onSelectItem(item.raw)}
      onChangeValue={onChangeValue}
      max={DEFAULT_MAX_VALUE || max}
      containerStyle={CONTAINER_STYLE}
      dropDownContainerStyle={DROPDOWN_LIST_STYLE}
      listMode={'SCROLLVIEW'}
    />
  );
};
