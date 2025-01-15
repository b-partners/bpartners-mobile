import { create } from 'zustand';

import { TSheetModalStore } from './type';

export const useSheetModal = create<TSheetModalStore>()(set => ({
  isOpen: false,
  content: null,
  containerStyle: {},
  panClose: true,
  close() {
    set({ isOpen: false, content: null });
  },
  open(content, options) {
    set({ isOpen: true, content, containerStyle: options?.containerStyle || {}, panClose: options?.panClose !== false });
  },
}));
