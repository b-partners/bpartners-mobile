import React from 'react';
import { MenuView } from '@react-native-menu/menu';
import { TouchableOpacity } from 'react-native';

type MenuItem = { id: string; title: string; subItems?: MenuItem[] };

type MenuProps = { items: MenuItem[]; actions: Record<string, (...args: any) => void> };

export const Menu: React.FC<MenuProps> = props => {
  const { items, children, actions } = props;

  if (!children) {
    return null;
  }

  return (
    <MenuView actions={items.map(item => ({ id: item.id, title: item.title }))} onPressAction={({ nativeEvent }) => actions[nativeEvent.event]()}>
      <TouchableOpacity>{children}</TouchableOpacity>
    </MenuView>
  );
};
