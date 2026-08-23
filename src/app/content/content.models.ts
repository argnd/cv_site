export type HeroSectionContent = {
  name: string;
  headline: string;
  location: string;
  linkedinUrl: string;
};

export type AboutSectionContent = {
  email: string;
  about: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  details: string;
};

export type GameSectionContent = {
  kicker: string;
  title: string;
  description: string;
};

export type FooterSectionContent = {
  name: string;
};
