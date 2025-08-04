import React from 'react';

export interface Environment {
  apiUrl: string;
  apiDomain: string;
  turnServerApiUrl?: string;
}
export const EnvironmentContext = React.createContext<Environment | null>(null);
