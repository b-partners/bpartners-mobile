import React, { FC, useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { color } from '../../theme';
import { BpInput, BpInputProps } from './bp-input';

export const BpPasswordInput: FC<BpInputProps> = props => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleView = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <BpInput
      {...props}
      secureTextEntry={!isVisible}
      endIcon={<IonIcon testID='togglePasswordVisibility' name={isVisible ? 'eye-off-outline' : 'eye-sharp'} size={28} color={color.palette.secondaryColor} />}
      onPressEndIcon={toggleView}
    />
  );
};
