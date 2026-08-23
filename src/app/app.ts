import { Component, computed, signal } from '@angular/core';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { EducationSectionComponent } from './components/education-section/education-section.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { FooterSectionComponent } from './components/footer-section/footer-section.component';
import { GamesSectionComponent } from './components/games-section/games-section.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { LocaleSelectorComponent } from './components/locale-selector/locale-selector.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import appShellEnData from './content/app-shell.en.json';
import appShellData from './content/app-shell.json';
import aboutSectionEnData from './content/about-section.en.json';
import aboutSectionData from './content/about-section.json';
import educationSectionEnData from './content/education-section.en.json';
import educationSectionData from './content/education-section.json';
import experienceSectionEnData from './content/experience-section.en.json';
import experienceSectionData from './content/experience-section.json';
import footerSectionEnData from './content/footer-section.en.json';
import footerSectionData from './content/footer-section.json';
import gamesSectionEnData from './content/games-section.en.json';
import gamesSectionData from './content/games-section.json';
import heroSectionEnData from './content/hero-section.en.json';
import heroSectionData from './content/hero-section.json';
import skillsSectionEnData from './content/skills-section.en.json';
import skillsSectionData from './content/skills-section.json';
import {
  AppShellContent,
  AboutSectionContent,
  EducationSectionContent,
  ExperienceSectionContent,
  FooterSectionContent,
  GamesSectionContent,
  HeroSectionContent,
  SupportedLocale,
  SkillsSectionContent,
} from './content/content.models';

function detectLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') {
    return 'fr';
  }

  const browserLocales = navigator.languages && navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  return browserLocales.some((locale) => locale.toLowerCase().startsWith('fr')) ? 'fr' : 'en';
}

type ShootingStarConfig = {
  top: number;
  left: number;
  delay: number;
  duration: number;
  /** Direction of travel in degrees (CSS rotate convention: 0 = right, 90 = down). */
  angle: number;
  /** Flight distance in pixels. */
  distance: number;
};

type ShootingStar = ShootingStarConfig & {
  dx: number;
  dy: number;
  trailAngle: number;
};

/**
 * Derives the flight vector (dx/dy) and the comet trail's rotation from a single
 * direction of travel, so the trail always points exactly opposite the way the
 * star is actually moving, however it's angled.
 */
function createShootingStar(config: ShootingStarConfig): ShootingStar {
  const radians = (config.angle * Math.PI) / 180;
  return {
    ...config,
    dx: Math.cos(radians) * config.distance,
    dy: Math.sin(radians) * config.distance,
    trailAngle: config.angle + 180,
  };
}

@Component({
  selector: 'app-root',
  imports: [
    AboutSectionComponent,
    EducationSectionComponent,
    ExperienceSectionComponent,
    FooterSectionComponent,
    GamesSectionComponent,
    HeroSectionComponent,
    LocaleSelectorComponent,
    SkillsSectionComponent,
  ],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly locale = signal<SupportedLocale>(detectLocale());
  protected readonly appShellContent = computed<AppShellContent>(() =>
    this.locale() === 'fr' ? appShellData : appShellEnData,
  );
  protected readonly heroContent = computed<HeroSectionContent>(() =>
    this.locale() === 'fr' ? heroSectionData : heroSectionEnData,
  );
  protected readonly aboutContent = computed<AboutSectionContent>(() =>
    this.locale() === 'fr' ? aboutSectionData : aboutSectionEnData,
  );
  protected readonly experienceContent = computed<ExperienceSectionContent>(() =>
    this.locale() === 'fr' ? experienceSectionData : experienceSectionEnData,
  );
  protected readonly educationContent = computed<EducationSectionContent>(() =>
    this.locale() === 'fr' ? educationSectionData : educationSectionEnData,
  );
  protected readonly skillsContent = computed<SkillsSectionContent>(() =>
    this.locale() === 'fr' ? skillsSectionData : skillsSectionEnData,
  );
  protected readonly gamesContent = computed<GamesSectionContent>(() =>
    this.locale() === 'fr' ? gamesSectionData : gamesSectionEnData,
  );
  protected readonly footerContent = computed<FooterSectionContent>(() =>
    this.locale() === 'fr' ? footerSectionData : footerSectionEnData,
  );

  protected readonly heroStars = [
    { top: 8, left: 14, size: 2, delay: 0, duration: 4.6 },
    { top: 16, left: 78, size: 3, delay: 0.6, duration: 5.2 },
    { top: 28, left: 46, size: 2, delay: 1.2, duration: 3.8 },
    { top: 11, left: 60, size: 2, delay: 1.8, duration: 4.9 },
    { top: 38, left: 22, size: 3, delay: 0.3, duration: 5.6 },
    { top: 5, left: 36, size: 2, delay: 2.1, duration: 4.2 },
    { top: 21, left: 90, size: 2, delay: 1.4, duration: 3.6 },
    { top: 46, left: 70, size: 2, delay: 0.9, duration: 5.0 },
    { top: 14, left: 5, size: 3, delay: 2.6, duration: 4.4 },
    { top: 33, left: 55, size: 2, delay: 1.6, duration: 3.9 },
    { top: 3, left: 85, size: 2, delay: 0.4, duration: 4.7 },
    { top: 24, left: 30, size: 2, delay: 2.0, duration: 5.4 },
  ];

  protected readonly shootingStars: ShootingStar[] = [
    createShootingStar({ top: 14, left: 82, delay: 0, duration: 10, angle: 145, distance: 260 }),
    createShootingStar({ top: 26, left: 48, delay: 4.5, duration: 12, angle: 155, distance: 230 }),
    createShootingStar({ top: 7, left: 62, delay: 9, duration: 11, angle: 138, distance: 280 }),
  ];

  protected readonly birds = [
    { top: 18, delay: 0, duration: 26 },
    { top: 30, delay: 15, duration: 23 },
  ];

  protected readonly clouds = [
    { top: 10, scale: 1, delay: 0, duration: 115 },
    { top: 23, scale: 0.68, delay: 34, duration: 145 },
    { top: 5, scale: 0.8, delay: 70, duration: 130 },
  ];

  protected isNight = true;

  constructor() {
    this.syncDocumentLanguage(this.locale());
  }

  protected toggleTheme(): void {
    this.isNight = !this.isNight;
  }

  protected setLocale(locale: SupportedLocale): void {
    this.locale.set(locale);
    this.syncDocumentLanguage(locale);
  }

  private syncDocumentLanguage(locale: SupportedLocale): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }
}
