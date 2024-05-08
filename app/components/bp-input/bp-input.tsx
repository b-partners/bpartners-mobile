import React, { ComponentProps, FC, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { TxKeyPath, translate } from '../../i18n';
import { palette } from '../../theme/palette';
import InputField from '../input-field/input-field';

export interface BpInputProps extends Omit<ComponentProps<typeof InputField>, 'onChange' | 'value' | 'backgroundColor' | 'errorMessage' | 'error'> {
  name: string;
  endIconName?: ReactNode;
  onPressEndIcon?: () => void;
}

export const BpInput: FC<BpInputProps> = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error ? translate(error.message as TxKeyPath) : '';

  return (
    <View style={{ marginBottom: 10, width: '100%', position: 'relative' }}>
      <Controller
        control={control}
        name={name}
        defaultValue=''
        render={({ field: { ref: _ref, ...field } }) => (
          <InputField {...field} {...props} error={!!error} errorMessage={errorMessage} backgroundColor={palette.white} />
        )}
      />
    </View>
  );
};
