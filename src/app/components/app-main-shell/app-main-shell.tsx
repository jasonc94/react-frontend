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
  const [opened, { toggle }] = useDisclosure();

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
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <div></div>
          <Group>
            <Switch
              checked={computedColorScheme === 'dark'}
              size="xl"
              onLabel="Dark"
              offLabel="Light"
              onChange={toggleColorScheme}
            />
            <Code fw={700}>v3.1.2</Code>
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
