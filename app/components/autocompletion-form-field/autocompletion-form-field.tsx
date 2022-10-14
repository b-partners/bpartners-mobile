import React, { useEffect, useRef } from 'react';
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';

interface AutocompletionFormFieldProps<T> {
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  data: T[];
  value: any;
  id?: string;
  title?: string;
  onValueChange: (item: TAutocompleteDropdownItem) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
}

const DEFAULT_ID_KEY = 'id';
const DEFAULT_TITLE_KEY = 'title';

export const AutocompletionFormField = observer(<T extends { id: string }>(props: AutocompletionFormFieldProps<T>) => {
  const dropdownController = useRef(null);

  const { data, id, title, value, containerStyle, inputContainerStyle, onSearch, onValueChange, onClear } = props;

  const dataSet = data.map(item => ({
    id: item[id || DEFAULT_ID_KEY],
    title: item[title || DEFAULT_TITLE_KEY],
  }));

  useEffect(() => {
    onValueChange(value);
    value &&
      dropdownController.current.setItem({
        id: value[id || DEFAULT_ID_KEY],
        title: value[title || DEFAULT_TITLE_KEY],
      });
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
});
