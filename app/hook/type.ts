import { AreaPictureAnnotationInstance, AreaPictureDetails, InvoiceStatus } from '@bpartners/typescript-client';
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
  panClose: boolean;
}

interface SheetModalOptions {
  containerStyle?: ViewStyle;
  panClose?: boolean;
}

interface SheetModalAction {
  open: (content: ReactNode, options?: SheetModalOptions) => void;
  close: () => void;
}

export type TSheetModalStore = SheetModalState & SheetModalAction;

export interface RouteParamsState {
  annotatorEdition: {
    annotations?: AreaPictureAnnotationInstance[];
    pictureUrl?: string;
    areaPictureDetails?: AreaPictureDetails;
    draftAnnotationId?: string;
  };
  invoiceForm: {
    areaPictureId?: string;
    initialStatus?: InvoiceStatus;
    invoiceId?: string;
  };
}
interface RouteParamsAction {
  setParams(key: keyof RouteParamsState, value: RouteParamsState[typeof key]): void;
  resetParams(key: keyof RouteParamsState): void;
}

export type TRouteParams = RouteParamsState & RouteParamsAction;
