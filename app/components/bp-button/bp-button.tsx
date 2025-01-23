import React, { FC } from 'react';
import { Button, ButtonProps } from 'react-native-paper';

import { palette } from '../../theme/palette';
import { BpButtonStyle as style } from './style';

export const BpButton: FC<ButtonProps> = props => {
  return (
    <Button {...props} textColor={props.textColor || palette.white} style={[style.base, props.style, (props.loading || props.disabled) && style.loading]}>
      {props.children}
    </Button>
  );
};
