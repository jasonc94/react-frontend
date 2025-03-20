import { Card, Title, Text } from '@mantine/core';
import styles from './summary.module.scss';

export function Summary() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className={styles.title}>
        About me
      </Title>
      <p className={styles.text}>
        Hey! I'm <strong>Jason Cai</strong>. I am a full-stack software engineer
        with <strong> 7+ years </strong>of experience designing, building, and
        deploying scalable, high-performance applications. Along the way, I've
        led teams, mentored devs, and delivered projects that make things run
        smoother and smarter. Always up for a challenge and excited to learn
        something new and cool!
      </p>
    </Card>
  );
}

export default Summary;
