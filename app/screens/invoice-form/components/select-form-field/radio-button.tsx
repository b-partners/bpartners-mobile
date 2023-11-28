import { palette } from '../../../../theme/palette';
import { CircleOutline } from './circle-outline';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { FC } from 'react';

type TRadioButton = {
  isActive?: boolean;
};

const RadioButton: FC<TRadioButton> = props => {
  const { isActive } = props;

  if (isActive) {
    return <Icon name={'disc'} size={28} color={palette.secondaryColor} />;
  }
  return <CircleOutline size={20} />;
};

export default RadioButton;
