import React, { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { View } from 'react-native';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { TxKeyPath, translate } from '../../i18n';
import { color, spacing } from '../../theme';
import ErrorMessage from '../forms/error-message';
import { Text } from '../text/text';
import { bpInputSelectStyle as style } from './style';

export interface BpInputSelectProps
  extends Omit<SelectDropdownProps, 'onChange' | 'renderButton' | 'renderItem' | 'onSelect' | 'value' | 'backgroundColor' | 'errorMessage' | 'error'> {
  name: string;
  label: string;
  getItemTitle?: (item: any) => string;
  getItemValue?: (item: any) => any;
  getItemDefaultValue?: (currentValue: any) => any;
  renderItem: (selectedItem: any, itemTitle: string, index: number, isSelected: boolean) => React.ReactNode;
}

export const BpInputSelect: FC<BpInputSelectProps> = ({ name, label, getItemTitle, getItemValue, getItemDefaultValue, renderItem, ...props }) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const value = useWatch({ name });

  const error = errors[name];
  const errorMessage = error ? translate(error.message as TxKeyPath) : '';

  const handleSelect = (selectedItem: any, _index: number) => {
    setValue(name, getItemValue ? getItemValue(selectedItem) : selectedItem);
  };

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
