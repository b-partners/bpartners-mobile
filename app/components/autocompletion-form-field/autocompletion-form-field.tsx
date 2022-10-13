import React, { useEffect, useState } from 'react';
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { ViewStyle } from 'react-native';

interface AutocompletionFormFieldProps<T> {
  data: any[];
  value: any;
  selectTitle: (item: T) => TAutocompleteDropdownItem;
  onChangeText?: (text: string) => void;
  onSelectItem: (item: TAutocompleteDropdownItem) => void;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
}

export function AutocompletionFormField<T>(props: AutocompletionFormFieldProps<T>) {
  const { data, selectTitle, value, onChangeText, onSelectItem, onClear, containerStyle, inputContainerStyle } = props;
  const [dataSet, setDataSet] = useState<TAutocompleteDropdownItem[]>([]);

  useEffect(() => {
    setDataSet(data.map(item => selectTitle(item)));
  }, [data, selectTitle]);

  return (
    <AutocompleteDropdown
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
      dataSet={dataSet}
      initialValue={value}
      onChangeText={onChangeText}
      onSelectItem={item => onSelectItem(item)}
      onClear={onClear}
    />
  );
}
