import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useSheetModal } from '../../hook';
import { sheetModalStyles } from './styles';

export const SheetModal = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { isOpen, close, containerStyle, content } = useSheetModal();

  useEffect(() => {
    isOpen && bottomSheetModalRef.current?.present();
  }, [isOpen]);

  const height: ViewStyle = isOpen ? sheetModalStyles.fullHeight : { height: 0, display: 'none' };
  const handleSheetChanges = useCallback((index: number) => {
    if (index !== 0) close();
  }, []);
  return (
    <GestureHandlerRootView style={{ ...sheetModalStyles.container, ...height }}>
      <BottomSheetModalProvider>
        <BottomSheetModal ref={bottomSheetModalRef} onChange={handleSheetChanges}>
          <BottomSheetView style={{ ...sheetModalStyles.contentContainer, ...containerStyle }}>{content}</BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
