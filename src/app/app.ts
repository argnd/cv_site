import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { BIRD_FLOCKS } from './animations/birds';
import { RAINDROP_PATH } from './animations/cloud-art';
import { createClouds, RAINDROPS } from './animations/clouds';
import { HILL_CATS } from './animations/hills';
import { ScrollParallax } from './animations/scroll-parallax';
import { createShootingStars, HERO_STARS } from './animations/stars';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { CelestialBodyComponent } from './components/celestial-body/celestial-body.component';
import { EducationSectionComponent } from './components/education-section/education-section.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { FooterSectionComponent } from './components/footer-section/footer-section.component';
import { GamesSectionComponent } from './components/games-section/games-section.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { LocaleSelectorComponent } from './components/locale-selector/locale-selector.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { detectLocale } from './content/locale';
import { siteContent } from './content/site-content';
import { SupportedLocale } from './models/content.models';

/** Browser-chrome colour for each skin, mirroring `--sky-void`. */
const CHROME_COLOR = { night: '#05060d', day: '#2ea8ec' } as const;

/**
 * The page shell. It owns exactly three things — the locale, the day/night
 * skin, and the scroll parallax — and delegates the rest:
 *
 * - `content/`    the localized copy, one stable object per locale
 * - `models/`     the shape of that copy, and of the scenery below
 * - `animations/` the decorative sky: its data, its motion and its stylesheets
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AboutSectionComponent,
    CelestialBodyComponent,
    EducationSectionComponent,
    ExperienceSectionComponent,
    FooterSectionComponent,
    GamesSectionComponent,
    HeroSectionComponent,
    LocaleSelectorComponent,
    SkillsSectionComponent,
  ],
  /* Concatenated in this order, and both ends are load-bearing: `app.css`
     defines the theme tokens the scenery reads, and `reduced-motion.css`
     strips motion back out of everything before it. */
  styleUrls: [
    './app.css',
    './animations/styles/sky.css',
    './animations/styles/stars.css',
    './animations/styles/birds.css',
    './animations/styles/clouds.css',
    './animations/styles/hills.css',
    './animations/styles/parallax.css',
    './animations/styles/reduced-motion.css',
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly locale = signal<SupportedLocale>(detectLocale());

  /** Every string on the page, for the active locale. */
  protected readonly content = computed(() => siteContent(this.locale()));

  protected readonly isNight = signal(true);

  /* Decorative scenery. Tables that never change are module constants shared by
     every instance; the two with randomized timing are rebuilt here, so each
     mount gets its own roll. */
  protected readonly heroStars = HERO_STARS;
  protected readonly shootingStars = createShootingStars();
  protected readonly flocks = BIRD_FLOCKS;
  protected readonly clouds = createClouds();
  protected readonly raindrops = RAINDROPS;
  protected readonly raindropPath = RAINDROP_PATH;
  protected readonly hillCats = HILL_CATS;

  private readonly skyRef = viewChild<ElementRef<HTMLElement>>('sky');
  private readonly parallax = new ScrollParallax(() => this.skyRef()?.nativeElement);

  /* Captured here rather than inside the `afterNextRender` callback: that runs
     outside the injection context, so `inject()` would throw there. */
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.syncDocumentLanguage(this.locale());
    effect(() => this.syncColorScheme(this.isNight()));
    afterNextRender(() => this.destroyRef.onDestroy(this.parallax.start()));
  }

  protected toggleTheme(): void {
    this.isNight.update((value) => !value);
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

  /**
   * Keeps the UA-level theme in step with the in-page one. Without this the
   * root `color-scheme` stays `dark` in daylight, so scrollbars, form controls
   * and the mobile browser chrome stay night-colored around a light page.
   */
  private syncColorScheme(isNight: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.style.colorScheme = isNight ? 'dark' : 'light';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isNight ? CHROME_COLOR.night : CHROME_COLOR.day);
  }
}
