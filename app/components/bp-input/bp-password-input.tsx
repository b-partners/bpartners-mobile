import React, { FC, useState } from 'react';

import { Log } from '../../screens/welcome/utils/utils';
import { BpInput, BpInputProps } from './bp-input';

export const BpPasswordInput: FC<BpInputProps> = props => {
  const [isVisible, setVisible] = useState(false);
  const toggleView = () => {
    Log('here');
    setVisible(prev => !prev);
  };

  return <BpInput {...props} secureTextEntry={!isVisible} endIconName={isVisible ? 'eye-off-outline' : 'eye-sharp'} onPressEndIcon={toggleView} />;
};
