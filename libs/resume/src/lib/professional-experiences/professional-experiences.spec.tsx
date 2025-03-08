import { render } from '@testing-library/react';

import ProfessionalExperiences from './professional-experiences';

describe('ProfessionalExperiences', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfessionalExperiences />);
    expect(baseElement).toBeTruthy();
  });
});
