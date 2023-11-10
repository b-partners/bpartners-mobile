import React, { Dispatch, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { BulletSeparator, Text } from '../../../components';
import { Customer as ICustomer } from '../../../models/entities/customer/customer';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { BODY_TEXT_STYLE, DATE_CONTAINER, DATE_TEXT_STYLE } from '../../invoices/utils/styles';
import { CustomerModalType } from '../customers-screen';
import { customerStyles as styles } from '../utils/styles';

type CustomerProps = { item: ICustomer; setCreationModal: Dispatch<SetStateAction<CustomerModalType>> };

export const Customer: React.FC<CustomerProps> = props => {
  const { item, setCreationModal } = props;

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          setCreationModal({
            type: 'EDITION',
            state: true,
            customer: item,
          })
        }
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: spacing[2],
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text
              text={item.firstName}
              style={{
                fontSize: 16,
                color: palette.textClassicColor,
                marginTop: spacing[4],
                marginHorizontal: spacing[1],
              }}
            />
            <Text text={item.lastName} style={{ fontSize: 16, color: palette.textClassicColor, marginTop: spacing[4] }} />
          </View>
          <Text
            text={item.phone}
            style={{
              fontSize: 16,
              color: palette.textClassicColor,
              marginTop: spacing[4],
              marginRight: spacing[1],
            }}
          />
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 2,
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
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
