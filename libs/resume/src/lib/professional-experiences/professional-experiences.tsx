import { Company } from '@JC/models';
import classes from './professional-experiences.module.scss';
import CompanyExperience from '../company-experience/company-experience';
import { Flex } from '@mantine/core';

const mockExperience: Company[] = [];

export function ProfessionalExperiences() {
  return (
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
  );
}

export default ProfessionalExperiences;
