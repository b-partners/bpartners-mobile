import React, { FC, useEffect, useRef, useState } from 'react';
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';

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

export const AutocompletionFormField: FC<AutocompletionFormFieldProps<any>> = observer(
  ({ data, selectTitle, value, onSearch, onClear, containerStyle, inputContainerStyle, onValueChange }) => {
    const [dataSet, setDataSet] = useState<TAutocompleteDropdownItem[]>([]);
    const dropdownController = useRef(null);

    useEffect(() => {
      setDataSet(data.map(item => selectTitle(item)));
    }, [data, selectTitle]);

    useEffect(() => {
      onValueChange(value);
      value && dropdownController.current.setItem(selectTitle(value));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <AutocompleteDropdown
        controller={controller => {
          dropdownController.current = controller;
        }}
        containerStyle={containerStyle}
        inputContainerStyle={inputContainerStyle}
        dataSet={dataSet}
        initialValue={value}
        onChangeText={onSearch}
        onSelectItem={item => onValueChange(item)}
        onClear={onClear}
      />
    );
  }
);
