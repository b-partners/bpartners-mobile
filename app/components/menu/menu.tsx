import { MenuView } from '@react-native-menu/menu';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export type MenuItem = { id: string; title: string; subItems?: MenuItem[] };

export type MenuAction = Record<string, (...args: any) => void>;

export type MenuProps = { items: MenuItem[]; actions: MenuAction };

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
