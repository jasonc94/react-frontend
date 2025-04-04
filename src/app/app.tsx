// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { MantineProvider } from '@mantine/core';
import AppMainShell from './components/app-main-shell/app-main-shell';
import { EnvironmentContext } from '@JC/shared/context';
import { environment } from './environment-config';
import { Notifications } from '@mantine/notifications';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';

export function App() {
  return (
    <MantineProvider>
      <Notifications />
      <EnvironmentContext value={environment}>
        <AppMainShell />
      </EnvironmentContext>
    </MantineProvider>
  );
}

export default App;
