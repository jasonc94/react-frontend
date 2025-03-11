// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { MantineProvider } from '@mantine/core';
import AppMainShell from './components/app-main-shell/app-main-shell';
import { EnvironmentContext } from '@JC/shared/context';
import { environment } from './environment-config';

export function App() {
  return (
    <MantineProvider>
      <EnvironmentContext.Provider value={environment}>
        <AppMainShell />
      </EnvironmentContext.Provider>
    </MantineProvider>
  );
}

export default App;
