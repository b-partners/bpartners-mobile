import { Invoice as IInvoice, InvoiceStatus } from '../../../models/entities/invoice/invoice';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components';
import { BulletSeparator } from '../../../components/bullet-separator/bullet-separator';
import { currencyPipe, datePipe } from '../../../utils/pipes';
import React from 'react';
import { BODY_TEXT_STYLE, CENTERED_ROW, HEADER_TEXT_STYLE, ROW_STYLE } from '../styles';
import { spacing } from '../../../theme';
import { translate } from '../../../i18n';

type InvoiceProps = { item: IInvoice; editInvoice: () => void };

export const Invoice: React.FC<InvoiceProps> = props => {
  const { editInvoice, item } = props;
  const { format } = currencyPipe(translate('currency'));
  const totalPriceWithVat = format(item.totalPriceWithVat);

  return (
    <TouchableOpacity onPress={() => editInvoice()} disabled={item.status !== InvoiceStatus.DRAFT}>
      <View style={{ paddingVertical: spacing[2] }}>
        <View style={{ ...ROW_STYLE, ...{ marginBottom: spacing[1] } }}>
          <Text text={props.item.customer.name} style={HEADER_TEXT_STYLE} />
          <Text text={totalPriceWithVat} style={HEADER_TEXT_STYLE} />
        </View>
        <View
          style={{
            ...ROW_STYLE,
            ...{
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          }}
        />
        <View style={{ ...ROW_STYLE }}>
          <View style={{ ...ROW_STYLE, ...CENTERED_ROW }}>
            <Text text={`#${props.item.ref}`} style={BODY_TEXT_STYLE} />
            <BulletSeparator />
            <Text text={datePipe(props.item.sendingDate)} style={BODY_TEXT_STYLE} />
          </View>
          <Text text={props.item.status} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
