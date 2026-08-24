import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { PlatformLocation } from '@angular/common';
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
import { localeFromPath, localizePath } from './content/locale';
import { siteContent } from './content/site-content';
import { SupportedLocale } from './models/content.models';
import { GAMES_PATH, pushPath, startSectionRouting } from './navigation/section-route';
import { syncDocumentHead } from './seo/document-head';

/**
 * The three skins, in the order the toggle lays them out. `slate` is the
 * default: a neutral, unlit page that says nothing about the reader's taste,
 * with the two scenic ones a click away.
 */
export type Theme = 'slate' | 'night' | 'day';

/** The toggle's stops, left to right; a skin's index here is the thumb's. */
const THEME_ORDER: readonly Theme[] = ['slate', 'night', 'day'];

/** Browser-chrome colour for each skin, mirroring `--sky-void`. */
const CHROME_COLOR: Record<Theme, string> = {
  slate: '#182238',
  night: '#05060d',
  day: '#2ea8ec',
};

/**
 * The page shell. It owns exactly three things — the locale, the skin, and the
 * scroll parallax — and delegates the rest:
 *
 * - `content/`    the localized copy, one stable object per locale
 * - `models/`     the shape of that copy, and of the scenery below
 * - `animations/` the decorative sky: its data, its motion and its stylesheets
 * - `navigation/` the one section that has a URL of its own
 * - `seo/`        what the `<head>` says about whichever locale is on screen
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
  /* Injected before anything reads them: `locale` is initialized from the URL,
     and field initializers run top to bottom. */
  private readonly document = inject(DOCUMENT);
  private readonly platformLocation = inject(PlatformLocation);

  /**
   * The translation on screen, taken from the URL rather than the browser.
   * `/` is French and `/en` English, each prerendered and indexed separately —
   * see `content/locale.ts` for why the browser's preference is not consulted.
   */
  protected readonly locale = signal<SupportedLocale>(
    localeFromPath(this.platformLocation.pathname),
  );

  /** Every string on the page, for the active locale. */
  protected readonly content = computed(() => siteContent(this.locale()));

  /** The games section's URL in the locale on screen: `/project` or `/en/project`. */
  protected readonly gamesPath = computed(() => localizePath(GAMES_PATH, this.locale()));

  protected readonly theme = signal<Theme>('slate');

  /** Which stop the toggle's thumb sits on, handed to CSS as `--thumb-index`. */
  protected readonly themeIndex = computed(() => THEME_ORDER.indexOf(this.theme()));

  /**
   * Nothing hangs in slate's sky, so a first-time reader has no way of knowing
   * the other two skins exist. The nudge beside the toggle says so, and any
   * deliberate use of the control — including re-picking the skin already on
   * screen — retires it for the rest of the visit.
   */
  private readonly themePicked = signal(false);
  protected readonly showThemeHint = computed(() => !this.themePicked());

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
    /* Synchronously, not in an effect: this also runs during prerendering,
       where the head has to be complete by the time the document is
       serialized to a file. */
    syncDocumentHead(this.document, this.locale());
    effect(() => this.syncColorScheme(this.theme()));
    afterNextRender(() => {
      this.destroyRef.onDestroy(this.parallax.start());
      /* After render, so the section it may need to scroll to exists. */
      this.destroyRef.onDestroy(
        startSectionRouting((pathname) => this.applyLocale(localeFromPath(pathname))),
      );
    });
  }

  protected setTheme(theme: Theme): void {
    this.themePicked.set(true);
    this.theme.set(theme);
  }

  /**
   * Switches translation, which is a navigation: each locale has its own
   * indexed URL, so the address bar has to follow or a shared link would hand
   * the reader back the language they just left. The scroll position stays put
   * — the reader asked for other words, not another place on the page.
   */
  protected setLocale(locale: SupportedLocale): void {
    if (locale === this.locale()) {
      return;
    }

    pushPath(localizePath(this.platformLocation.pathname, locale));
    this.applyLocale(locale);
  }

  private applyLocale(locale: SupportedLocale): void {
    this.locale.set(locale);
    syncDocumentHead(this.document, locale);
  }

  /**
   * Keeps the UA-level theme in step with the in-page one. Without this the
   * root `color-scheme` stays `dark` in daylight, so scrollbars, form controls
   * and the mobile browser chrome stay night-colored around a light page.
   */
  private syncColorScheme(theme: Theme): void {
    this.document.documentElement.style.colorScheme = theme === 'day' ? 'light' : 'dark';
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', CHROME_COLOR[theme]);
  }
}
