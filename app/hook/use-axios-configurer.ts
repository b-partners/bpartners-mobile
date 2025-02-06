import { AxiosError } from 'axios';
import { useLayoutEffect } from 'react';

import { getAxiosInstance } from '../config/axios';

export const useAxiosConfigurer = ({ onAuthError }: { onAuthError: () => Promise<void> }) => {
  useLayoutEffect(() => {
    const axiosInstance = getAxiosInstance();
    let resInterceptor: number;

    const setupAxiosInterceptors = async () => {
      resInterceptor = axiosInstance.interceptors.response.use(
        response => response,
        async (error: AxiosError) => {
          if (error?.response?.status === 403) {
            await onAuthError();
          }
          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptors();

    return () => {
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, []);
};
