import { ProfessionalExperiences, Summary } from '@JC/resume';
import styles from './home.module.scss';
import { Badge, Container, Stack, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function Home() {
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);

  return (
    <Stack
      bg="var(--mantine-color-body)"
      align="center"
      justify="center"
      gap="md"
    >
      <Container px={0} size={matches ? '515px' : '1500px'}>
        <Summary />
      </Container>

      <ProfessionalExperiences />
    </Stack>
  );
}

export default Home;
