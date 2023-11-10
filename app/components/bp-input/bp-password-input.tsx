import React, { FC, useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { Log } from '../../screens/welcome/utils/utils';
import { color } from '../../theme';
import { BpInput, BpInputProps } from './bp-input';

export const BpPasswordInput: FC<BpInputProps> = props => {
  const [isVisible, setVisible] = useState(false);
  const toggleView = () => {
    Log('here');
    setVisible(prev => !prev);
  };

  return (
    <BpInput
      {...props}
      secureTextEntry={!isVisible}
      endIcon={<IonIcon name={isVisible ? 'eye-off-outline' : 'eye-sharp'} size={28} color={color.palette.secondaryColor} />}
      onPressEndIcon={toggleView}
    />
  );
};