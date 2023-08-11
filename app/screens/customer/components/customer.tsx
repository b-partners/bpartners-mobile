import React from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { BulletSeparator, Text } from '../../../components';
import { Customer as ICustomer } from '../../../models/entities/customer/customer';
import { spacing } from '../../../theme';
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
} from '../../invoices/styles';
import { customerStyles as styles } from '../utils/styles';

type CustomerProps = { item: ICustomer };

const BOTTOM_MARGIN_STYLE: ViewStyle = { marginBottom: spacing[2] };
const TOTAL_PRICE_WITH_THAT_STYLE: TextStyle = {
  fontWeight: 'normal',
};

export const Customer: React.FC<CustomerProps> = props => {
  const { item } = props;

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity style={styles.container}>
        <View style={{ ...ROW_STYLE, ...BOTTOM_MARGIN_STYLE }}>
          <Text text={item.firstName} style={HEADER_TEXT_STYLE} />
          <Text text={item.lastName} style={{ ...HEADER_TEXT_STYLE, ...TOTAL_PRICE_WITH_THAT_STYLE }} />
        </View>

        <View style={{ ...ROW_STYLE, ...{ flex: 1 } }}>
          <View style={{ ...ROW_STYLE, ...CENTERED_ROW, ...{ flex: 1, flexWrap: 'wrap' }, ...BODY_TEXT_CONTAINER }}>
            <Text text={`#${item.email}`} style={BODY_TEXT_STYLE} />
            <View style={DATE_CONTAINER}>
              <BulletSeparator style={BULLET_SEPARATOR_STYLE} containerStyle={BULLET_SEPARATOR_CONTAINER_STYLE} />
              <Text text={item.address} style={[BODY_TEXT_STYLE, DATE_TEXT_STYLE]} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
