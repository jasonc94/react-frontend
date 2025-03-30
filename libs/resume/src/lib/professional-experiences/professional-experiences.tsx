import { Company } from '@JC/models';
import classes from './professional-experiences.module.scss';
import CompanyExperience from '../company-experience/company-experience';
import { Flex, Card, Title } from '@mantine/core';
import { useApi } from '@JC/shared/api';
import { useEffect, useState } from 'react';

export function ProfessionalExperiences() {
  const { api } = useApi(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await api.get<Company[]>('/resume/companies/'); // Fetch users

        setCompanies(response.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []); // Re-fetch if `api` changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3} className={classes.title} mb="lg">
        Professional Experience
      </Title>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="center"
        align="stretch"
        gap={{ base: 'xl', lg: 'md' }}
        wrap="nowrap"
      >
        {companies.map((company, index) => (
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
