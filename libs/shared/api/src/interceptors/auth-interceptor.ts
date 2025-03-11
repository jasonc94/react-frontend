import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';
import { useContext } from 'react';
import { EnvironmentContext } from '@JC/shared/context';

export const useApi = (addAuthHeader = true) => {
  const env = useContext(EnvironmentContext);
  const api = axios.create({
    baseURL: env?.apiUrl,
  });

  if (addAuthHeader) {
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  return { api };
};

export default useApi;
