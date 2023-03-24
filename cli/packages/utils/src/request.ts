import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import log from './log';

const BASE_URL = 'http://localhost:13000/api';

const service: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    return config;
  },
  (error: any): Promise<any> => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    log.verbose('response', response.data);
    return response.data;
  },
  (error: any): Promise<any> => {
    return Promise.reject(error);
  },
);

export default service;
