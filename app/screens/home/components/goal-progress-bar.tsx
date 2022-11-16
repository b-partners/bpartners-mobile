import React from 'react';
import { View, ViewStyle } from 'react-native';

import { Icon, Text } from '../../../components';
import { color, spacing } from '../../../theme';

const ROW: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

export function GoalProgressBar() {
  return (
    <View style={{ marginVertical: spacing[4] }}>
      <View
        style={{
          height: 40,
          flex: 1,
          backgroundColor: color.palette.white,
          borderRadius: 50,
        }}
      >
        <View
          style={{
            position: 'absolute',
            backgroundColor: color.palette.lighterGrey,
            height: 40,
            width: '40%',
            borderTopLeftRadius: 25,
            borderBottomLeftRadius: 25,
          }}
        ></View>
        <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text tx='homeScreen.summary.goals' style={{ textTransform: 'uppercase', color: color.palette.black }} />
        </View>
      </View>
      <View style={{ ...ROW, ...{ justifyContent: 'space-between', marginTop: spacing[2] } }}>
        <View style={ROW}>
          <Text text='42%' />
          <View style={{ marginHorizontal: spacing[1] }}></View>
          <Text text='Réalisé'></Text>
        </View>
        <View style={ROW}>
          <Text text='100 000 €'></Text>
          <View style={{ marginHorizontal: spacing[1] }}></View>
          <Icon icon='coins' />
        </View>
      </View>
    </View>
  );
}
