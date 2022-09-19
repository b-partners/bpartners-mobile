import React from 'react';
import Autocomplete from 'react-native-autocomplete-input';

type AutocompletionFormFieldProps = {
  data: any[];
  hideResults?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  keyExtractor: (item: any, index: any) => any;
  renderItem: (props: any) => JSX.Element;
};

export const AutocompletionFormField: React.FC<AutocompletionFormFieldProps> = props => {
  const { data, value, onChangeText, keyExtractor, renderItem, hideResults } = props;

  return (
    <Autocomplete
      data={data}
      value={value}
      onChangeText={onChangeText}
      flatListProps={{
        keyExtractor,
        renderItem,
      }}
      hideResults={hideResults}
    />
  );
};
