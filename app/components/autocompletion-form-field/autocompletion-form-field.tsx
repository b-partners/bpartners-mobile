import React, { useEffect, useState } from 'react';
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

interface AutocompletionFormFieldProps<T> {
  data: any[];
  value: string;
  selectTitle: (item: T) => TAutocompleteDropdownItem;
  onChangeText: (text: string) => void;
  onSelectItem: (item: TAutocompleteDropdownItem) => void;
}

export function AutocompletionFormField<T>(props: AutocompletionFormFieldProps<T>) {
  const { data, selectTitle, value, onChangeText, onSelectItem } = props;
  const [dataSet, setDataSet] = useState<TAutocompleteDropdownItem[]>([]);

  useEffect(() => {
    setDataSet(data.map(item => selectTitle(item)));
  }, [data, selectTitle]);

  return <AutocompleteDropdown dataSet={dataSet} initialValue={value} onChangeText={onChangeText} onSelectItem={item => onSelectItem(item)} />;
}
