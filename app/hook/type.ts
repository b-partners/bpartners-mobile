import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

import { TxKeyPath } from '../i18n';
import { TRootStoreModelKey } from '../models';

export interface UseFetchOptions {
  store?: TRootStoreModelKey;
  mutateOnly?: boolean;
  txErrorMessage?: TxKeyPath;
}

interface SheetModalState {
  content: ReactNode;
  isOpen: boolean;
  containerStyle: ViewStyle;
}

interface SheetModalOptions {
  containerStyle?: ViewStyle;
}

interface SheetModalAction {
  open: (content: ReactNode, options?: SheetModalOptions) => void;
  close: () => void;
}

export type TSheetModalStore = SheetModalState & SheetModalAction;
