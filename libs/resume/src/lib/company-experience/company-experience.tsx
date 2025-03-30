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
  Flex,
  AspectRatio,
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
      <Flex direction="column" justify="space-between" className="flex">
        <div>
          <Card.Section>
            <AspectRatio
              ratio={450 / 200}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Image src={company.logo} alt={company.name} fit="contain" />
            </AspectRatio>
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
        </div>
        <div>
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
              N/A
            </Button>
            <ActionIcon variant="default" radius="md" size={36}>
              <IconHeart className={classes.like} stroke={1.5} />
            </ActionIcon>
          </Group>
        </div>
      </Flex>
    </Card>
  );
}

export default CompanyExperience;
