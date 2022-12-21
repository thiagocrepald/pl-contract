import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AuthUtils from '../util/auth-utils';

const createApiInstance = (): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 60 * 1000
  };

  const instance = axios.create(config);

  // tslint:disable-next-line: no-shadowed-variable
  instance.interceptors.request.use(async config => {
    const token = AuthUtils.getToken();
    if (token != null && token.trim() !== '') config.headers.Authorization = `Basic ${token}`;
    return config;
  });

  return instance;
};

export const api = createApiInstance();
export default { api };
