import { Company } from '@JC/models';
import classes from './professional-experiences.module.scss';
import CompanyExperience from '../company-experience/company-experience';
import { Flex, Card, Title } from '@mantine/core';

const mockExperience: Company[] = [
  {
    name: 'A Company',
    startDate: new Date('2022-01-01'),
    endDate: null,
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
    logoUrl:
      'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    projects: [
      {
        name: 'A',
        startDate: new Date('2021-01-01'),
        endDate: null,
        technologies: [
          'C#',
          'TypeScript',
          'Azure Functions',
          'Angular',
          'Python',
          'WPF',
          'MongoDB',
          'PostgreSQL',
          'Azure DevOps',
          'Azure SignalR',
          'Azure Storage',
          'Azure Service Bus',
          'Azure API Management',
          'PowerShell',
          'Postman',
        ],
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
      },
      {
        name: 'A',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-01'),
        technologies: [
          'Angular',
          'ASP.NET Core',
          'Twilio',
          'SendGrid',
          'SqlServer',
          'Bootstrap',
          'TypeScript',
        ],
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
      },
    ],
  },
  {
    name: 'B Company',
    startDate: new Date('2022-01-01'),
    endDate: null,
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
    logoUrl:
      'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    projects: [
      {
        name: 'A',
        startDate: new Date('2021-01-01'),
        endDate: null,
        technologies: [
          'C#',
          'TypeScript',
          'Azure Functions',
          'Angular',
          'Python',
          'WPF',
          'MongoDB',
          'PostgreSQL',
          'Azure DevOps',
          'Azure SignalR',
          'Azure Storage',
          'Azure Service Bus',
          'Azure API Management',
          'PowerShell',
          'Postman',
        ],
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
      },
      {
        name: 'B',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-01'),
        technologies: [
          'Angular',
          'ASP.NET Core',
          'Twilio',
          'SendGrid',
          'SqlServer',
          'Bootstrap',
          'TypeScript',
        ],
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
      },
    ],
  },
  {
    name: 'C Company',
    startDate: new Date('2022-01-01'),
    endDate: null,
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
    logoUrl:
      'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    projects: [
      {
        name: 'A',
        startDate: new Date('2021-01-01'),
        endDate: null,
        technologies: [
          'C#',
          'TypeScript',
          'Azure Functions',
          'Angular',
          'Python',
          'WPF',
          'MongoDB',
          'PostgreSQL',
          'Azure DevOps',
          'Azure SignalR',
          'Azure Storage',
          'Azure Service Bus',
          'Azure API Management',
          'PowerShell',
          'Postman',
        ],
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
      },
      {
        name: 'B',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-01'),
        technologies: [
          'Angular',
          'ASP.NET Core',
          'Twilio',
          'SendGrid',
          'SqlServer',
          'Bootstrap',
          'TypeScript',
        ],
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.',
      },
    ],
  },
];

export function ProfessionalExperiences() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className={classes.title} mb="lg">
        Professional Experience
      </Title>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="center"
        align="center"
        gap={{ base: 'xl', lg: 'md' }}
        wrap="nowrap"
      >
        {mockExperience.map((company, index) => (
          <CompanyExperience
            className={classes.company}
            key={index}
            company={company}
          />
        ))}
      </Flex>
    </Card>
  );
}

export default ProfessionalExperiences;
