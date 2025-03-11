import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';
import useApi from '../interceptors/auth-interceptor';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const { api } = useApi();

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const response = await api.post('/api/token/refresh/', {
        refresh: refreshToken,
      });
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const auth = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }
      const jwtToken = jwtDecode(accessToken);
      const exp = jwtToken.exp;
      if (exp && exp < Date.now() / 1000) {
        await refreshToken();
      } else {
        setIsAuthenticated(true);
      }
    };

    auth().catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/home" />;
}

export default AuthGuard;
