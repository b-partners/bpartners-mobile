import React, { FC } from 'react';
import { Button, ButtonProps } from 'react-native-paper';

import { palette } from '../../theme/palette';
import { Loader } from '../loader/loader';
import { BpButtonStyle as style } from './style';

export const BpButton: FC<ButtonProps> = props => {
  return (
    <Button {...props} style={[props.style, props.loading && style.loading]} disabled={props.loading}>
      {props.loading && <Loader size='small' color={palette.purple} />}
      {props.children}
    </Button>
  );
};
