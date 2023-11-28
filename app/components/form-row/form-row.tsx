import { PRESETS } from './form-row.presets';
import { FormRowProps } from './form-row.props';
import * as React from 'react';
import { View } from 'react-native';

/**
 * A horizontal container component used to hold a row of a form.
 */
export function FormRow(props: FormRowProps) {
  const viewStyle = [PRESETS[props.preset], props.style];

  return <View style={viewStyle}>{props.children}</View>;
}
