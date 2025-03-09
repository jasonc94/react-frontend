import { Card, Title, Text } from '@mantine/core';
import styles from './summary.module.scss';

export function Summary() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className={styles.title}>
        Summary
      </Title>
      <p className={styles.text}>
        Experienced Software Engineer with <strong> 7+ years </strong>of
        experience in designing, developing, and deploying scalable,
        high-performance applications across
        <strong> healthcare, finance, and aviation industries.</strong> Proven
        expertise in{' '}
        <strong>
          full-stack development, cloud-native solutions, and system
          modernization.
        </strong>{' '}
        Skilled in leading cross-functional teams, mentoring junior developers,
        and delivering innovative solutions that drive{' '}
        <strong>operational efficiency and business growth.</strong>
      </p>
    </Card>
  );
}

export default Summary;
