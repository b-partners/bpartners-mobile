import React from 'react';
import { View } from 'react-native';
import IoniconIcon from 'react-native-vector-icons/Ionicons';

import { Text } from '../../../components';
import { translate } from '../../../i18n';
import { palette } from '../../../theme/palette';
import { formatDate } from '../../../utils/format-date';
import { relaunchItemStyles as styles } from '../utils/styles';
import { RelaunchItemProps } from '../utils/utils';

export const RelaunchItem: React.FC<RelaunchItemProps> = props => {
  const { item, index, setCurrentRelaunch } = props;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.numberColumn}>
        <View style={styles.numberContainer}>
          <Text text={(index + 1).toString()} style={{ fontFamily: 'Geometria', color: palette.white, fontSize: 15, fontWeight: 'bold' }} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text text={`${translate('relaunchHistoryModal.quotationRelaunchedAt')} ${formatDate(item.creationDatetime)}`} style={styles.title} />
        <Text text={item.emailInfo.emailObject} style={styles.object} numberOfLines={1} />
      </View>
      <View style={styles.iconContainer}>
        <IoniconIcon name='eye-sharp' size={28} color={palette.secondaryColor} onPress={() => setCurrentRelaunch(item)} />
      </View>
    </View>
  );
};
