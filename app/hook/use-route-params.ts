import { useEffect } from 'react';
import { create } from 'zustand';

import { RouteParamsState, TRouteParams } from './type';

const initialValues: RouteParamsState = {
  annotatorEdition: {
    annotations: [],
    areaPictureDetails: {},
    draftAnnotationId: undefined,
    pictureUrl: undefined,
  },
  invoiceForm: {
    areaPictureId: undefined,
    initialStatus: undefined,
    invoiceId: undefined,
  },
};
/**
 * This is here to store params between screen cause react native navigation have problem to reset route params
 */
export const useRouteParams = create<TRouteParams>()(set => ({
  annotatorEdition: initialValues.annotatorEdition,
  invoiceForm: initialValues.invoiceForm,
  resetParams(key) {
    set(() => ({ [key]: initialValues[key] }));
  },
  setParams(key, value) {
    set(() => ({ [key]: value }));
  },
}));

export const useResetRouteParams = (key: keyof RouteParamsState, navigation: any) => {
  const { resetParams } = useRouteParams();
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetParams(key);
    });
    return unsubscribe;
  }, []);
};

export const useRouteParamsEffect = <K extends keyof RouteParamsState>(key: K, callback: (values: RouteParamsState[K]) => void) => {
  useEffect(() => {
    const unsubscribe = useRouteParams.subscribe(states => {
      callback(states[key]);
    });
    return unsubscribe;
  });
};
