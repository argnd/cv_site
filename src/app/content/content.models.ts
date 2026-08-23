export type SupportedLocale = 'fr' | 'en';

export type LocaleSelectorContent = {
  label: string;
  frenchLabel: string;
  englishLabel: string;
};

export type AppShellContent = {
  themeToggleAriaLabel: string;
  localeSelector: LocaleSelectorContent;
};

export type HeroSectionContent = {
  kicker: string;
  name: string;
  headline: string;
  location: string;
  linkedinUrl: string;
  linkedinLabel: string;
  gamesLinkLabel: string;
};

export type AboutSectionContent = {
  kicker: string;
  title: string;
  email: string;
  /** Sanitized through Angular's innerHTML binding, allowing basic HTML formatting in JSON content. */
  bodyPrimary: string;
  /** Sanitized through Angular's innerHTML binding, allowing basic HTML formatting in JSON content. */
  bodyExpanded: string;
  expandLabel: string;
  collapseLabel: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  mainData: string;
  highlights: string[];
  technicalEnvironment: string[];
};

export type ExperienceSectionContent = {
  kicker: string;
  title: string;
  listAriaLabel: string;
  technicalEnvironmentLabel: string;
  expandDetailsLabel: string;
  collapseDetailsLabel: string;
  items: ExperienceItem[];
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  details: string;
};

export type EducationSectionContent = {
  kicker: string;
  title: string;
  items: EducationItem[];
};

export type SkillsSectionContent = {
  kicker: string;
  title: string;
  items: string[];
};

export type GamesSectionContent = {
  kicker: string;
  title: string;
  description: string;
};

export type FooterSectionContent = {
  name: string;
};
