import React, { Dispatch, SetStateAction, useState } from 'react';
import { FlatList, ListRenderItem, TextStyle, View, ViewStyle } from 'react-native';
import { AutocompletionFormField, Button } from '../../../components';
import { Product } from '../../../models/entities/product/product';

type AddItemProps = {
  containerStyle?: ViewStyle;
  data: any[];
  selectedItems: any[];
  setSelectedItems: Dispatch<SetStateAction<any>>;
  selectTitle: (item) => { id: any; title: any };
  renderItem: ListRenderItem<any>;
  onChange?: (items: any) => void;
  onChangeText?: () => void;
  onClear: () => void;
};

const BUTTON_TEXT_STYLE: TextStyle = { fontSize: 14 };

export function AddItem<T extends { id: string }>(props: AddItemProps) {
  const { renderItem, data, onClear, selectTitle, onChangeText, containerStyle, selectedItems, setSelectedItems } = props;
  const [addItem, setAddItem] = useState(false);

  return (
    <View style={containerStyle}>
      <FlatList<T> data={selectedItems} renderItem={renderItem} />

      {!addItem && <Button tx='invoiceScreen.labels.addItem' onPress={() => setAddItem(true)} textStyle={BUTTON_TEXT_STYLE} />}

      {addItem && (
        <AutocompletionFormField<Product>
          value={''}
          data={data.filter(newItem => !selectedItems.map(selectedItem => selectedItem.id).includes(newItem.id))}
          selectTitle={selectTitle}
          onClear={onClear}
          onSelectItem={selectedItem => {
            if (!data || !selectedItem) {
              return;
            }
            const item = data.find(i => i.id === selectedItem.id);
            setSelectedItems(prevState => [...prevState, item]);
            setAddItem(false);
          }}
          onChangeText={onChangeText}
        />
      )}
    </View>
  );
}
