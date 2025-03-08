// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { MantineProvider } from '@mantine/core';
import AppMainShell from './components/app-main-shell/app-main-shell';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/code-highlight/styles.css';

export function App() {
  return (
    <MantineProvider>
      <AppMainShell />
    </MantineProvider>
  );
}

export default App;
