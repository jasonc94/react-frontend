import { ProfessionalExperiences, Summary } from '@JC/resume';
import styles from './home.module.scss';
import {
  Badge,
  Card,
  Container,
  Stack,
  Title,
  useMantineTheme,
  Text,
  List,
} from '@mantine/core';
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

      <Container px={0} size={matches ? '515px' : '1500px'}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} className={styles.title}>
            About The Site
          </Title>
          <p>
            Welcome to my personal portfolio and experimental playground! This
            site serves as a showcase of my projects, skills, and ongoing
            learning journey. It's a space where I explore new technologies,
            explore fresh ideas, and build cool things
          </p>
          <p>
            I built the app using <strong>React</strong> with{' '}
            <strong>Nx</strong> to keep everything organized, styled it with{' '}
            <strong>Mantine</strong>, and the backend is powered by{' '}
            <strong>Django</strong>. For deployment, everything runs smoothly on{' '}
            <strong>AWS</strong>, with an automated CI/CD pipeline
          </p>

          <Title order={4} mt="lg">
            Technology Stack
          </Title>
          <List withPadding>
            <List.Item>
              <strong>React</strong> - Fronend SPA
            </List.Item>
            <List.Item>
              <strong>Nx</strong> - Faster build times and better organization
            </List.Item>
            <List.Item>
              <strong>Mantine</strong> - UI components and design
            </List.Item>
            <List.Item>
              <strong>Python Django</strong> - Backend API
            </List.Item>
            <List.Item>
              <strong>Django Channel</strong> - Websocket for realtime
              communication
            </List.Item>
            <List.Item>
              <strong>Docker</strong> - To package the backend for deployment
            </List.Item>
            <List.Item>
              <strong>AWS</strong> - Cloud hosting and services
            </List.Item>
            <List.Item>
              <strong>CodeBuild</strong> - Automated builds
            </List.Item>
            <List.Item>
              <strong>CodeDeploy</strong> - Deployment automation
            </List.Item>
            <List.Item>
              <strong>S3</strong> - Static site hosting
            </List.Item>
          </List>

          <Title order={4} mt="lg">
            Cool Stuff You Can Check Out
          </Title>
          <List withPadding>
            <List.Item>
              <strong>Portfolio</strong> - Showcasing my projects and
              experiences
            </List.Item>
            <List.Item>
              <strong>Games</strong> - Fun little web games and experiments
            </List.Item>
            <List.Item>
              <strong>Squad Connect</strong> - Real-time video chat using WebRTC
            </List.Item>
          </List>

          <Text mt="lg">
            Take a look around, see what I've been working on, and if you like
            what you see, let's connect!
          </Text>
        </Card>
      </Container>

      <ProfessionalExperiences />
    </Stack>
  );
}

export default Home;
