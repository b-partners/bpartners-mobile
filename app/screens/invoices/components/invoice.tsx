import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Text } from '../../../components';
import { BulletSeparator } from '../../../components/bullet-separator/bullet-separator';
import { Menu, MenuAction, MenuItem } from '../../../components/menu/menu';
import { Invoice as IInvoice, InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { printCurrencyToMajors } from '../../../utils/money';
import { datePipe } from '../../../utils/pipes';
import {
  BODY_TEXT_CONTAINER,
  BODY_TEXT_STYLE,
  BULLET_SEPARATOR_CONTAINER_STYLE,
  BULLET_SEPARATOR_STYLE,
  CENTERED_ROW,
  DATE_CONTAINER,
  DATE_TEXT_STYLE,
  HEADER_TEXT_STYLE,
  ROW_STYLE,
  STATUS_CONTAINER,
  STATUS_TEXT,
} from '../styles';

type InvoiceProps = { item: IInvoice; menuItems: MenuItem[]; menuAction: MenuAction };

const INVOICE_CONTAINER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row' };
const INVOICE_STYLE: ViewStyle = { paddingBottom: spacing[2], paddingTop: spacing[0], flex: 1 };
const BOTTOM_MARGIN_STYLE: ViewStyle = { marginBottom: spacing[2] };
const MENU_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: spacing[3],
};
const TOTAL_PRICE_WITH_THAT_STYLE: TextStyle = {
  fontWeight: 'normal',
};

export const Invoice: React.FC<InvoiceProps> = props => {
  const { item, menuItems, menuAction } = props;

  // return the correct color depending on the invoice status
  const getStatusTextColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PROPOSAL:
      case InvoiceStatus.CONFIRMED:
        return palette.orange;
      case InvoiceStatus.DRAFT:
        return palette.greyDarker;
      default:
        return palette.green;
    }
  };

  const textColor: TextStyle = { color: getStatusTextColor(item.status) };

  return (
    <View style={INVOICE_CONTAINER_STYLE}>
      <TouchableOpacity style={INVOICE_STYLE}>
        <View style={{ ...ROW_STYLE, ...BOTTOM_MARGIN_STYLE }}>
          <Text text={props.item.customer.firstName} style={HEADER_TEXT_STYLE} />
          <Text text={printCurrencyToMajors(item.totalPriceWithVat)} style={{ ...HEADER_TEXT_STYLE, ...TOTAL_PRICE_WITH_THAT_STYLE }} />
        </View>

        <View style={{ ...ROW_STYLE, ...{ flex: 1 } }}>
          <View style={{ ...ROW_STYLE, ...CENTERED_ROW, ...{ flex: 1, flexWrap: 'wrap' }, ...BODY_TEXT_CONTAINER }}>
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
      <View style={MENU_CONTAINER_STYLE}>
        <Menu items={menuItems} actions={menuAction}>
          <MaterialCommunityIcons name='dots-vertical' size={22} color={palette.lightGrey} />
        </Menu>
      </View>
    </View>
  );
};