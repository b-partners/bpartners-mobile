import React, { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { TxKeyPath, translate } from '../../i18n';
import { BpInputSelectBase, BpInputSelectBaseProps } from './bp-input-select-base';

export interface BpInputSelectProps extends Omit<BpInputSelectBaseProps, 'onChange' | 'value' | 'errorMessage'> {}

export const BpInputSelect: FC<BpInputSelectProps> = ({ name, ...props }) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const value = useWatch({ name });
  const error = errors[name];
  const errorMessage = error ? translate(error.message as TxKeyPath) : null;
  return <BpInputSelectBase {...props} onChange={currentValue => setValue(name, currentValue)} value={value} errorMessage={errorMessage} name={name} />;
};
