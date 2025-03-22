import {
  AppShell,
  Burger,
  Code,
  Group,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SideNav from '../side-nav/side-nav';
import AppRouting from '../app-routing/app-routing';

export function AppMainShell() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  // -> colorScheme is 'auto' | 'light' | 'dark'
  const { setColorScheme } = useMantineColorScheme();

  // -> computedColorScheme is 'light' | 'dark', argument is the default value
  const computedColorScheme = useComputedColorScheme('dark');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <div></div>
          <Group>
            <Switch
              checked={computedColorScheme === 'dark'}
              size="xl"
              onLabel="Dark"
              offLabel="Light"
              onChange={toggleColorScheme}
            />
            <Code fw={700}>v{import.meta.env.VITE_APP_VERSION}</Code>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <SideNav />
      </AppShell.Navbar>
      <AppShell.Main>
        <AppRouting />
      </AppShell.Main>
    </AppShell>
  );
}

export default AppMainShell;
