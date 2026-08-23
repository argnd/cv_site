import { SiteContent, SupportedLocale } from '../models/content.models';
import aboutSectionEn from './about-section.en.json';
import aboutSectionFr from './about-section.json';
import appShellEn from './app-shell.en.json';
import appShellFr from './app-shell.json';
import educationSectionEn from './education-section.en.json';
import educationSectionFr from './education-section.json';
import experienceSectionEn from './experience-section.en.json';
import experienceSectionFr from './experience-section.json';
import footerSectionEn from './footer-section.en.json';
import footerSectionFr from './footer-section.json';
import gamesSectionEn from './games-section.en.json';
import gamesSectionFr from './games-section.json';
import heroSectionEn from './hero-section.en.json';
import heroSectionFr from './hero-section.json';
import skillsSectionEn from './skills-section.en.json';
import skillsSectionFr from './skills-section.json';

/**
 * The two translations, assembled once at module load. Each locale's entry is a
 * stable object, so re-reading it on a locale change hands the section
 * components the exact same references they had before.
 */
const SITE_CONTENT: Record<SupportedLocale, SiteContent> = {
  fr: {
    appShell: appShellFr,
    hero: heroSectionFr,
    about: aboutSectionFr,
    experience: experienceSectionFr,
    education: educationSectionFr,
    skills: skillsSectionFr,
    games: gamesSectionFr,
    footer: footerSectionFr,
  },
  en: {
    appShell: appShellEn,
    hero: heroSectionEn,
    about: aboutSectionEn,
    experience: experienceSectionEn,
    education: educationSectionEn,
    skills: skillsSectionEn,
    games: gamesSectionEn,
    footer: footerSectionEn,
  },
};

export function siteContent(locale: SupportedLocale): SiteContent {
  return SITE_CONTENT[locale];
}
