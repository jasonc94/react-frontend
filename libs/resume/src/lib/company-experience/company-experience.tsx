import { Company } from '@JC/models';
import classes from './company-experience.module.scss';
import {
  Card,
  Group,
  Badge,
  Button,
  ActionIcon,
  Image,
  Text,
} from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';

export function CompanyExperience({
  company,
  className,
}: {
  company: Company;
  className?: string;
}) {
  return (
    <Card
      withBorder
      radius="md"
      p="md"
      className={`${classes.card} ${className}`}
    >
      <Card.Section>
        <Image
          src={company.logo}
          alt={company.name}
          height={180}
          w="60%"
          fit="contain"
        />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500} c={'blue'}>
            {company.name}
          </Text>
          <Badge size="sm" variant="light">
            {dayjs(company.startDate).format('MM/YYYY')} -{' '}
            {company.endDate
              ? dayjs(company.endDate).format('MM/YYYY')
              : 'Present'}
          </Badge>
        </Group>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(company.description),
            }}
          />
        </div>
        {/* <Text fz="sm" mt="xs">
          {company.description}
        </Text> */}
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Technologies / Tools
        </Text>
        <Group gap={7} mt={5}>
          {[
            ...new Set(
              company.projects?.flatMap((project) => project.technologies)
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
}

export default CompanyExperience;
