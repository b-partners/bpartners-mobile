import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import React, { FC, useCallback } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { BpInput, BpInputProps } from '../bp-input';

/**
 * Input like BpInput but handle keyboard when using @gorhom/bottom-sheet
 *
 * @param param0
 * @returns
 */
export const BpSheetInput: FC<BpInputProps> = ({ onBlur, onFocus, ...others }) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      if (onFocus) {
        onFocus(args);
      }
    },
    [onFocus, shouldHandleKeyboardEvents]
  );

  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      if (onBlur) {
        onBlur(args);
      }
    },
    [onBlur, shouldHandleKeyboardEvents]
  );

  return <BpInput {...others} onFocus={handleOnFocus} onBlur={handleOnBlur} />;
};
