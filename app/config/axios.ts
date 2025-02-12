import Axios, { AxiosInstance } from 'axios';

let axiosInstance: AxiosInstance | null = null;
export const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = Axios.create();
  }
  return axiosInstance;
};
