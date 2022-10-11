import React, { Dispatch, SetStateAction, useState } from 'react';
import { FlatList, ListRenderItem, View, ViewStyle } from 'react-native';
import { AutocompletionFormField, Button } from '../../../components';
import { Product } from '../../../models/entities/product/product';

type AddItemProps = {
  selectedItems: any[];
  setSelectedItems: Dispatch<SetStateAction<any>>;
  onChangeText: () => void;
  selectTitle: (item) => { id: any; title: any };
  data: any[];
  onClear: () => void;
  renderItem: ListRenderItem<any>;
  containerStyle?: ViewStyle;
};

export function AddItem<T extends { id: string }>(props: AddItemProps) {
  const { renderItem, data, onClear, selectTitle, onChangeText, containerStyle } = props;
  const [addItem, setAddItem] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  return (
    <View style={containerStyle}>
      <FlatList data={selectedItems} renderItem={renderItem} />
      {!addItem && <Button tx='invoiceScreen.labels.addItem' onPress={() => setAddItem(true)} />}
      {addItem && (
        <AutocompletionFormField<Product>
          onSelectItem={selectedItem => {
            if (!data || !selectedItem) {
              return;
            }
            const item = data.find(i => i.id === selectedItem.id);
            setSelectedItems(prevState => [...prevState, item]);
            setAddItem(false);
          }}
          onChangeText={onChangeText}
          selectTitle={selectTitle}
          value={''}
          data={data.filter(newItem => !selectedItems.map(selectedItem => selectedItem.id).includes(newItem.id))}
          onClear={onClear}
        />
      )}
    </View>
  );
}
