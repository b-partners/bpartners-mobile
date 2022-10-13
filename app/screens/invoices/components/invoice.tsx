import { Invoice as IInvoice } from '../../../models/entities/invoice/invoice';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components';
import { BulletSeparator } from '../../../components/bullet-separator/bullet-separator';
import { datePipe } from '../../../utils/pipes';
import React from 'react';
import { BODY_TEXT_STYLE, CENTERED_ROW, HEADER_TEXT_STYLE, ROW_STYLE } from '../styles';
import { spacing } from '../../../theme';

export function Invoice(props: { item: IInvoice; text: string }) {
  return (
    <TouchableOpacity>
      <View style={{ paddingVertical: spacing[2] }}>
        <View style={{ ...ROW_STYLE, ...{ marginBottom: spacing[1] } }}>
          <Text text={props.item.customer.name} style={HEADER_TEXT_STYLE} />
          <Text text={props.text} style={HEADER_TEXT_STYLE}></Text>
        </View>
        <View
          style={{
            ...ROW_STYLE,
            ...{
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          }}
        ></View>
        <View style={{ ...ROW_STYLE }}>
          <View style={{ ...ROW_STYLE, ...CENTERED_ROW }}>
            <Text text={`#${props.item.ref}`} style={BODY_TEXT_STYLE}></Text>
            <BulletSeparator />
            <Text text={datePipe(props.item.sendingDate)} style={BODY_TEXT_STYLE}></Text>
          </View>
          <Text text={props.item.status} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
