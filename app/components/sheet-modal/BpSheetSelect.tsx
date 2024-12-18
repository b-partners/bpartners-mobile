import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import React, { FC, useCallback } from 'react';

import { BpInputSelect, BpInputSelectProps } from '../bp-input';

/**
 * Input like BpInput but handle keyboard when using @gorhom/bottom-sheet
 *
 * @param param0
 * @returns
 */
export const BpSheetSelect: FC<BpInputSelectProps> = ({ onBlur, onFocus, ...others }) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleOnFocus = useCallback(() => {
    shouldHandleKeyboardEvents.value = true;
    if (onFocus) {
      onFocus();
    }
  }, [onFocus, shouldHandleKeyboardEvents]);

  const handleOnBlur = useCallback(() => {
    shouldHandleKeyboardEvents.value = false;
    if (onBlur) {
      onBlur();
    }
  }, [onBlur, shouldHandleKeyboardEvents]);

  return <BpInputSelect {...others} onBlur={handleOnBlur} onFocus={handleOnFocus} />;
};
