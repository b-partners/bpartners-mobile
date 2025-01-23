import React, { FC } from 'react';
import { View } from 'react-native';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { color, spacing } from '../../theme';
import ErrorMessage from '../forms/error-message';
import { Text } from '../text/text';
import { bpInputSelectStyle as style } from './style';

export interface BpInputSelectBaseProps
  extends Omit<SelectDropdownProps, 'onChange' | 'renderButton' | 'renderItem' | 'onSelect' | 'value' | 'backgroundColor' | 'errorMessage' | 'error'> {
  name: string;
  label: string;
  getItemTitle?: (item: any) => string;
  getItemValue?: (item: any) => any;
  getItemDefaultValue?: (currentValue: any) => any;
  renderItem: (selectedItem: any, itemTitle: string, index: number, isSelected: boolean) => React.ReactNode;
  onChange: (value: any) => void;
  value: any;
  errorMessage?: string;
}

export const BpInputSelectBase: FC<BpInputSelectBaseProps> = ({
  label,
  getItemTitle,
  getItemValue,
  getItemDefaultValue,
  renderItem,
  onChange,
  value,
  errorMessage,
  ...props
}) => {
  const handleSelect = (selectedItem: any, _index: number) => {
    onChange(getItemValue ? getItemValue(selectedItem) : selectedItem);
  };

  const error = !!errorMessage;

  return (
    <View style={style.container}>
      <SelectDropdown
        renderItem={(item, index, isSelected) => renderItem(item, getItemTitle ? getItemTitle(item) : item, index, isSelected)}
        defaultValue={getItemDefaultValue ? getItemDefaultValue(value) : value}
        renderButton={(selectedItem, isOpened) => (
          <View style={[style.button, error && style.buttonError]}>
            <View style={style.buttonTextContainer}>
              <Text style={[style.buttonLabelStyle]} text={label} />
              {selectedItem && <Text style={style.buttonSelectedItem} text={getItemTitle ? getItemTitle(selectedItem) : selectedItem} />}
            </View>
            <Icon style={style.icon} name={isOpened ? 'chevron-up' : 'chevron-down'} />
          </View>
        )}
        searchInputStyle={{ borderColor: error ? 'red' : 'transparent' }}
        onSelect={handleSelect}
        {...props}
      />
      <ErrorMessage name='error' error={errorMessage} visible={!!error} style={{ color: color.error, marginVertical: spacing[2] }} />
    </View>
  );
};
