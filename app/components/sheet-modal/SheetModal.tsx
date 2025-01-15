import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef } from 'react';
import { BackHandler, ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useSheetModal } from '../../hook';
import { sheetModalStyles } from './styles';

export const SheetModal = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { isOpen, close, containerStyle, content, panClose } = useSheetModal();

  useEffect(() => {
    const onBackPress = () => {
      if (isOpen) {
        close();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, [isOpen]);

  useEffect(() => {
    isOpen ? bottomSheetModalRef.current?.present() : bottomSheetModalRef.current?.dismiss();
  }, [isOpen]);

  const height: ViewStyle = isOpen ? sheetModalStyles.fullHeight : { height: 0, display: 'none' };
  const handleSheetChanges = useCallback((index: number) => {
    if (index !== 0) close();
  }, []);

  return (
    <GestureHandlerRootView style={{ ...sheetModalStyles.container, ...height }}>
      <BottomSheetModalProvider>
        <BottomSheetModal enableContentPanningGesture={panClose} enablePanDownToClose={panClose} ref={bottomSheetModalRef} onChange={handleSheetChanges}>
          <BottomSheetView style={{ ...sheetModalStyles.contentContainer, ...containerStyle }}>{content}</BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
