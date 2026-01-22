export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface PortfolioData {
  fullName: string;
  title: string;
  bio: string;
  email: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  projects: Project[];
  experiences: Experience[];
}

export enum Section {
  PERSONAL = 'Personal',
  SKILLS = 'Skills',
  PROJECTS = 'Projects',
  EXPERIENCE = 'Experience'
}