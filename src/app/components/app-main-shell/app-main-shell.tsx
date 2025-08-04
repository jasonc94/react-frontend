import {
  AppShell,
  Burger,
  Center,
  Code,
  Flex,
  Group,
  Loader,
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SideNav from '../side-nav/side-nav';
import AppRouting from '../app-routing/app-routing';
import classes from './app-main-shell.module.scss';
import { useEffect, useState } from 'react';
import { useAppStore } from '@JC/shared/store';

export function AppMainShell() {
  const [mobileOpened, { toggle: toggleMobile, close: closeNav }] =
    useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useAppStore((state) => state.setUser);
  const user = useAppStore((state) => state.user);

  // default to dark
  useEffect(() => {
    setColorScheme('dark');
  }, []);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    } else {
      const id = Math.random().toString(36).substring(2, 9);
      const user = { id: id, displayName: id };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    }
  }, [setUser]);

  useEffect(() => {
    if (user.id !== 'unknown') {
      setIsLoading(false);
    }
  }, [user]);

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
        <SideNav closeNav={closeNav} />
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        {isLoading ? (
          <Center h="90vh">
            <Loader size="100" />
          </Center>
        ) : (
          <AppRouting />
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default AppMainShell;
