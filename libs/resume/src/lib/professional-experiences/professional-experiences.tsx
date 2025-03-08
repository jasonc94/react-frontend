import { Company } from '@JC/models';
import styles from './professional-experiences.module.scss';
import CompanyExperience from '../company-experience/company-experience';

const mockExperience: Company[] = [];

export function ProfessionalExperiences() {
  return (
    <>
      {mockExperience.map((company) => (
        <CompanyExperience key={company.name} company={company} />
      ))}
    </>
  );
}

export default ProfessionalExperiences;
