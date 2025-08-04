export const environment = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  apiDomain: import.meta.env.VITE_API_DOMAIN || 'http://localhost:8000',
  turnServerApiUrl: import.meta.env.VITE_TURN_SERVER_API_URL,
};
