import React, { useEffect, useState } from 'react';
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { ViewStyle } from 'react-native';

interface AutocompletionFormFieldProps<T> {
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  data: any[];
  value: any;
  selectTitle: (item: T) => TAutocompleteDropdownItem;
  onValueChange: (item: TAutocompleteDropdownItem) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
}

export function AutocompletionFormField<T>(props: AutocompletionFormFieldProps<T>) {
  const { data, selectTitle, value, onSearch, onClear, containerStyle, inputContainerStyle, onValueChange } = props;
  const [dataSet, setDataSet] = useState<TAutocompleteDropdownItem[]>([]);

  useEffect(() => {
    setDataSet(data.map(item => selectTitle(item)));
  }, [data, selectTitle]);

  useEffect(() => {
    onValueChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <AutocompleteDropdown
        containerStyle={containerStyle}
        inputContainerStyle={inputContainerStyle}
        dataSet={dataSet}
        initialValue={value}
        onChangeText={onSearch}
        onSelectItem={item => onValueChange(item)}
        onClear={onClear}
      />
    </>
  );
}
