export interface Company {
  name: string;
  startDate: string;
  endDate: string | null;
  description: string;
  logo?: string;
  projects?: Project[];
}

export interface Project {
  name: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
}
