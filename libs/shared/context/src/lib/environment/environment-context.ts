import React from 'react';

export interface Environment {
  apiUrl: string;
}
export const EnvironmentContext = React.createContext<Environment | null>(null);
