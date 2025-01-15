import React, { FC } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
