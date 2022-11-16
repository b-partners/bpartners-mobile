import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Icon, Text } from '../../../components';
import { color, spacing } from '../../../theme';

const ROW: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const PROGRESS_BAR_BACKGROUND_STYLE: ViewStyle = {
  height: 40,
  flex: 1,
  backgroundColor: color.palette.white,
  borderRadius: 50,
};

const PROGRESS_BAR_CONTAINER: ViewStyle = { marginVertical: spacing[4] };

const PROGRESS_BAR_STYLE: ViewStyle = {
  position: 'absolute',
  backgroundColor: color.palette.lighterGrey,
  height: 40,
  width: '40%',
  borderTopLeftRadius: 25,
  borderBottomLeftRadius: 25,
};

const PROGRESS_BAR_TEXT_CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const PROGRESS_BAR_TEXT_STYLE: TextStyle = { textTransform: 'uppercase', color: color.palette.black };

export function GoalProgressBar() {
  return (
    <View style={PROGRESS_BAR_CONTAINER}>
      <View style={PROGRESS_BAR_BACKGROUND_STYLE}>
        <View style={PROGRESS_BAR_STYLE} />
        <View style={PROGRESS_BAR_TEXT_CONTAINER_STYLE}>
          <Text tx='homeScreen.summary.goals' style={PROGRESS_BAR_TEXT_STYLE} />
        </View>
      </View>
      <View style={{ ...ROW, ...{ justifyContent: 'space-between', marginTop: spacing[2] } }}>
        <View style={ROW}>
          <Text text='42%' />
          <View style={{ marginHorizontal: spacing[1] }} />
          <Text text='Réalisé' />
        </View>
        <View style={ROW}>
          <Text text='100 000 €' />
          <View style={{ marginHorizontal: spacing[1] }} />
          <Icon icon='coins' />
        </View>
      </View>
    </View>
  );
}
