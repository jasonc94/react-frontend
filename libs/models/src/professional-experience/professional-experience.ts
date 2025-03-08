export interface Company {
  name: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  logoUrl?: string;
  projects?: Project[];
}

export interface Project {
  name: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  technologies: string[];
}
