import { render } from '@testing-library/react';

import CompanyExperience from './company-experience';

describe('CompanyExperience', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CompanyExperience />);
    expect(baseElement).toBeTruthy();
  });
});
