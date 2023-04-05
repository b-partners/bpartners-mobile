import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { FC } from 'react';

import { color } from '../../../../theme';
import { CircleOutline } from './circle-outline';

type TRadioButton = {
  isActive?: boolean;
};

const RadioButton: FC<TRadioButton> = props => {
  const { isActive } = props;

  if (isActive) {
    return <Icon name={'disc'} size={25} color={color.primary} />;
  }
  return <CircleOutline size={20} />;
};

export default RadioButton;
