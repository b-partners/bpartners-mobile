// import { Octicons as Icon } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Text } from '../../../components';
import RadioButton from '../../../components/radio-button/radio-button';
import { TxKeyPath } from '../../../i18n';
import { spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

type TLabelRow = {
  labelKey: string;
  labels: object;
};

const KEY_STYLE: TextStyle = {
  color: palette.textClassicColor,
  fontWeight: 'bold',
  fontSize: 18,
};

const VALUE_STYLE: TextStyle = {
  color: palette.textClassicColor,
  fontWeight: '100',
  fontSize: 14,
};

const LABEL_ROW_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

const LabelRow: FC<TLabelRow> = props => {
  const { labelKey, labels } = props;

  return (
    <View style={{ ...LABEL_ROW_CONTAINER }}>
      <RadioButton isActive />
      <View style={{ ...LABEL_ROW_CONTAINER, justifyContent: 'space-between' }}>
        <Text tx={`annotationScreen.labels.${labelKey}` as TxKeyPath} style={{ ...KEY_STYLE, marginLeft: spacing[2], textTransform: 'capitalize' }} />
        <Text text={labels[labelKey] !== null ? labels[labelKey] : 'N/A'} style={{ ...VALUE_STYLE, marginLeft: spacing[2] }} />
      </View>
    </View>
  );
};

export default LabelRow;
