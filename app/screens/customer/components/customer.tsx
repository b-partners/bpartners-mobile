import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { BulletSeparator, Text } from '../../../components';
import { Customer as ICustomer } from '../../../models/entities/customer/customer';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { BODY_TEXT_STYLE, DATE_CONTAINER, DATE_TEXT_STYLE } from '../../invoices/styles';
import { customerStyles as styles } from '../utils/styles';

type CustomerProps = { item: ICustomer };

export const Customer: React.FC<CustomerProps> = props => {
  const { item } = props;

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity style={styles.container}>
        <View style={{ display: 'flex', flexDirection: 'row', marginBottom: spacing[2], justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text text={item.firstName} style={{ fontSize: 16, color: palette.textClassicColor, marginTop: spacing[4], marginHorizontal: spacing[1] }} />
            <Text text={item.lastName} style={{ fontSize: 16, color: palette.textClassicColor, marginTop: spacing[4] }} />
          </View>
          <Text text={item.phone} style={{ fontSize: 16, color: palette.textClassicColor, marginTop: spacing[4], marginRight: spacing[1] }} />
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <View style={{ display: 'flex', flexDirection: 'row', flex: 2, flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text text={`${item.email}`} style={{ fontSize: 14, color: palette.greyDarker, marginLeft: spacing[1] }} />
            <View style={DATE_CONTAINER}>
              <BulletSeparator style={{ marginLeft: spacing[2] }} containerStyle={{ alignItems: 'center', justifyContent: 'center' }} />
              <Text text={item.address} style={[BODY_TEXT_STYLE, DATE_TEXT_STYLE]} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
