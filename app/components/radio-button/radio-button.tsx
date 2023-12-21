import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { FC } from 'react';

import { CircleOutline } from '../../screens/invoice-form/components/select-form-field/circle-outline';
import { palette } from '../../theme/palette';

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
