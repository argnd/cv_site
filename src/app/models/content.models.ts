/**
 * Shape of the localized copy the page renders. The values themselves live as
 * JSON in `../content/`; these types are what makes that JSON typechecked at
 * the point it is imported.
 */

export type SupportedLocale = 'fr' | 'en';

export type LocaleSelectorContent = {
  label: string;
  frenchLabel: string;
  englishLabel: string;
};

/**
 * What the `<head>` says about the page, per locale. The served `index.html`
 * carries the French wording; switching locale rewrites it in place so that a
 * shared link and a bookmarked tab both read in the language the visitor
 * actually saw.
 */
export type DocumentMetaContent = {
  /** `<title>`, `og:title`, `twitter:title`. */
  title: string;
  /** `<meta name="description">`, `og:description`, `twitter:description`. */
  description: string;
  /** `<html lang>` and `og:locale` disagree on format; this is the latter. */
  openGraphLocale: string;
};

export type AppShellContent = {
  themeToggleAriaLabel: string;
  documentMeta: DocumentMetaContent;
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
  phone: string;
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

/** Every string the page renders, for one locale. */
export type SiteContent = {
  appShell: AppShellContent;
  hero: HeroSectionContent;
  about: AboutSectionContent;
  experience: ExperienceSectionContent;
  education: EducationSectionContent;
  skills: SkillsSectionContent;
  games: GamesSectionContent;
  footer: FooterSectionContent;
};
