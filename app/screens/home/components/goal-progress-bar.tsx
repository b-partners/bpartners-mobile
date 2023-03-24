import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { Icon, Text } from '../../../components';
import { AccountHolder as IAccountHolder } from '../../../models/entities/account-holder/account-holder';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';

const ROW: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const PROGRESS_BAR_BACKGROUND_STYLE: ViewStyle = {
  height: 30,
  flex: 1,
  backgroundColor: '#F5F5F5',
  borderRadius: 50,
};

const PROGRESS_BAR_STYLE: ViewStyle = {
  position: 'absolute',
  backgroundColor: palette.lightGrey,
  height: 30,
  borderTopLeftRadius: 50,
  borderBottomLeftRadius: 50,
};

const PROGRESS_BAR_CONTAINER: ViewStyle = { marginVertical: spacing[4] };

const PROGRESS_BAR_TEXT_CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const PROGRESS_BAR_TEXT_STYLE: TextStyle = {
  textTransform: 'uppercase',
  color: color.palette.black,
  fontFamily: 'Geometria',
  fontSize: 13,
};

interface GoalProgressBarProps {
  accountHolder: IAccountHolder;
}

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({ accountHolder: accountHolder }) => {
  const target = accountHolder.revenueTargets[0];

  const GoalAchievedInPercentage = (): string => {
    return `${(target.amountAttempted * 100) / target.amountTarget}%`;
  };

  return (
    <View style={PROGRESS_BAR_CONTAINER}>
      <View style={PROGRESS_BAR_BACKGROUND_STYLE}>
        <View style={{ ...PROGRESS_BAR_STYLE, width: GoalAchievedInPercentage() }} />
        <View style={PROGRESS_BAR_TEXT_CONTAINER_STYLE}>
          <Text tx='homeScreen.summary.goals' style={PROGRESS_BAR_TEXT_STYLE} />
        </View>
      </View>
      <View style={{ ...ROW, ...{ justifyContent: 'space-between', marginTop: spacing[2] } }}>
        <View style={ROW}>
          <Text text={GoalAchievedInPercentage()} style={{ fontFamily: 'Geometria-Bold', color: color.palette.textClassicColor }} />
          <View style={{ marginHorizontal: spacing[1] }} />
          <Text text='Réalisé' style={{ fontFamily: 'Geometria', color: '#BFC7DE' }} />
        </View>
        <View style={ROW}>
          <Text text={target.amountTarget.toString()} style={{ fontFamily: 'Geometria', color: color.palette.textClassicColor }} />
          <View style={{ marginHorizontal: spacing[1] }} />
          <Icon icon='coins' />
        </View>
      </View>
    </View>
  );
};
