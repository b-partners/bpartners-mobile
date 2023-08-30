import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TextStyle, TouchableOpacity, View } from 'react-native';

import { Text } from '../../../components';
import { BulletSeparator, Menu } from '../../../components';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors } from '../../../utils/money';
import { datePipe } from '../../../utils/pipes';
import {
  BODY_TEXT_STYLE,
  BULLET_SEPARATOR_CONTAINER_STYLE,
  BULLET_SEPARATOR_STYLE,
  DATE_CONTAINER,
  DATE_TEXT_STYLE,
  HEADER_TEXT_STYLE,
  STATUS_CONTAINER,
  STATUS_TEXT,
  invoiceStyles as styles,
} from '../utils/styles';
import { InvoiceProps, getStatusTextColor } from '../utils/utils';

export const Invoice: React.FC<InvoiceProps> = props => {
  const { item, menuItems, menuAction } = props;

  const textColor: TextStyle = { color: getStatusTextColor(item.status) };

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity style={styles.container}>
        <View style={styles.header}>
          <Text text={props.item.customer.firstName} style={HEADER_TEXT_STYLE} />
          <Text text={printCurrencyToMajors(item.totalPriceWithVat)} style={styles.totalPrice} />
        </View>

        <View style={styles.body}>
          <View style={styles.refContainer}>
            <Text text={`#${props.item.ref}`} style={BODY_TEXT_STYLE} />
            <View style={DATE_CONTAINER}>
              <BulletSeparator style={BULLET_SEPARATOR_STYLE} containerStyle={BULLET_SEPARATOR_CONTAINER_STYLE} />
              <Text text={datePipe(props.item.sendingDate).split(' ')[0]} style={[BODY_TEXT_STYLE, DATE_TEXT_STYLE]} />
            </View>
          </View>
          <View style={STATUS_CONTAINER}>
            <Text tx={`invoiceScreen.status.${props.item.status}`} style={[STATUS_TEXT, textColor]} />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.menuContainer}>
        <Menu items={menuItems} actions={menuAction}>
          <MaterialCommunityIcons name='dots-vertical' size={22} color={palette.lightGrey} />
        </Menu>
      </View>
    </View>
  );
};
