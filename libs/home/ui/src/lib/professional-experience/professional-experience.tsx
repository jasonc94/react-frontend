import { IconHeart } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
} from '@mantine/core';
import classes from './professional-experience.module.scss';
import { Company } from '@JC/models';

const mockdata = {
  image:
    'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
  title: 'Verudela Beach',
  country: 'Croatia',
  description:
    'Completely renovated for the season 2020, Arena Verudela Bech Apartments are fully equipped and modernly furnished 4-star self-service apartments located on the Adriatic coastline by one of the most beautiful beaches in Pula.',
  badges: [
    { emoji: '☀️', label: 'Sunny weather' },
    { emoji: '🦓', label: 'Onsite zoo' },
    { emoji: '🌊', label: 'Sea' },
    { emoji: '🌲', label: 'Nature' },
    { emoji: '🤽', label: 'Water sports' },
  ],
};

const mockExperience: Company[] = [];

export function ProfessionalExperience() {
  const experiencees = mockExperience.map((experience, index) => {
    return (
      <Card key={index} withBorder radius="md" p="md" className={classes.card}>
        <Card.Section>
          <Image src={experience.logoUrl} alt={experience.name} height={180} />
        </Card.Section>

        <Card.Section className={classes.section} mt="md">
          <Group justify="apart">
            <Text fz="lg" fw={500}>
              {experience.name}
            </Text>
            <Badge size="sm" variant="light">
              {experience.startDate.getFullYear()}
            </Badge>
          </Group>
          <Text fz="sm" mt="xs">
            {experience.description}
          </Text>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} c="dimmed">
            Technologies / Tools
          </Text>
          <Group gap={7} mt={5}>
            {[
              ...new Set(
                experience.projects?.flatMap((project) => project.technologies)
              ),
            ].map((technology) => (
              <Badge key={technology}>{technology}</Badge>
            ))}
          </Group>
        </Card.Section>

        <Group mt="xs">
          <Button radius="md" style={{ flex: 1 }}>
            Show details
          </Button>
          <ActionIcon variant="default" radius="md" size={36}>
            <IconHeart className={classes.like} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Card>
    );
  });

  return <div>{experiencees}</div>;
}

export default ProfessionalExperience;
