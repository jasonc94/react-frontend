import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';
import { useContext } from 'react';
import { EnvironmentContext } from '@JC/shared/context';
import { useAppStore } from '@JC/shared/store';

export const useApi = (addAuthHeader = true) => {
  const env = useContext(EnvironmentContext);
  const user = useAppStore((state) => state.user);
  const api = axios.create({
    baseURL: env?.apiUrl,
    headers: {
      'X-User-Id': user.id,
      'X-User-Name': encodeURIComponent(user.displayName),
    },
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
