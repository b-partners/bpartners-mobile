import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';

import { Icon, Text } from '../../../components';
import { BulletSeparator } from '../../../components/bullet-separator/bullet-separator';
import { Menu, MenuAction, MenuItem } from '../../../components/menu/menu';
import { translate } from '../../../i18n';
import { Invoice as IInvoice } from '../../../models/entities/invoice/invoice';
import { spacing } from '../../../theme';
import { currencyPipe, datePipe } from '../../../utils/pipes';
import { BODY_TEXT_STYLE, CENTERED_ROW, HEADER_TEXT_STYLE, ROW_STYLE } from '../styles';

type InvoiceProps = { item: IInvoice; menuItems: MenuItem[]; menuAction: MenuAction };

const INVOICE_CONTAINER_STYLE: ViewStyle = { display: 'flex', flexDirection: 'row' };
const INVOICE_STYLE: ViewStyle = { paddingVertical: spacing[2], flex: 1 };
const BOTTOM_MARGIN_STYLE: ViewStyle = { marginBottom: spacing[1] };
const POSITION_STYLE: ViewStyle = {
  justifyContent: 'flex-start',
  alignItems: 'center',
};
const MENU_CONTAINER_STYLE: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: spacing[3],
};

export const Invoice: React.FC<InvoiceProps> = props => {
  const { item, menuItems, menuAction } = props;

  const { format } = currencyPipe(translate('currency'));
  const totalPriceWithVat = format(item.totalPriceWithVat);

  return (
    <View style={INVOICE_CONTAINER_STYLE}>
      <TouchableOpacity style={INVOICE_STYLE}>
        <View style={{ ...ROW_STYLE, ...BOTTOM_MARGIN_STYLE }}>
          <Text text={props.item.customer.name} style={HEADER_TEXT_STYLE} />
          <Text text={totalPriceWithVat} style={HEADER_TEXT_STYLE} />
        </View>
        <View
          style={{
            ...ROW_STYLE,
            ...POSITION_STYLE,
          }}
        />
        <View style={{ ...ROW_STYLE, ...{ flex: 1 } }}>
          <View style={{ ...ROW_STYLE, ...CENTERED_ROW, ...{ flex: 1, flexWrap: 'wrap' } }}>
            <Text text={`#${props.item.ref}`} style={BODY_TEXT_STYLE} />
            <BulletSeparator />
            <Text text={datePipe(props.item.sendingDate)} style={BODY_TEXT_STYLE} />
          </View>
          <Text text={props.item.status} />
        </View>
      </TouchableOpacity>
      <View style={MENU_CONTAINER_STYLE}>
        <Menu items={menuItems} actions={menuAction}>
          <Icon icon='menu' />
        </Menu>
      </View>
    </View>
  );
};
