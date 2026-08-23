import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { CelestialBodyComponent } from './components/celestial-body/celestial-body.component';
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

  const browserLocales =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];
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

/** Random float in [min, max). */
function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Builds shooting stars with randomized (but constrained) flight paths.
 * `.sky` is `position: fixed`, so a star's on-screen spot never changes with
 * scroll — meaning "avoid the text" can't just mean "avoid the hero
 * heading," it has to hold at any scroll position. The one thing that stays
 * constant everywhere is that page copy always lives in the centered
 * ~720px `.page` column, so each star spawns in the left/right margin
 * outside it and is only allowed to travel further toward its own edge
 * (angle biased away from center), never sweeping back across the middle.
 * Zones alternate by index so a small batch doesn't randomly cluster on one
 * side; everything else (offset, angle, timing, distance) is randomized for
 * genuinely varied trajectories star to star.
 */
function generateShootingStars(count: number): ShootingStar[] {
  return Array.from({ length: count }, (_, i) => {
    const zone: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
    const left = zone === 'left' ? randomBetween(3, 20) : randomBetween(80, 97);
    const angle = zone === 'left' ? randomBetween(105, 255) : randomBetween(-75, 75);

    return createShootingStar({
      top: randomBetween(4, 52),
      left,
      delay: randomBetween(0, 16),
      duration: randomBetween(9, 13.5),
      angle,
      distance: randomBetween(170, 300),
    });
  });
}

/**
 * Cloud silhouettes, in a `0 0 200 96` viewBox. Each one is the exact outline of
 * a chain of overlapping circles resting on a shared flat baseline, so the lobes
 * meet in true tangent-free arcs — no seams to hide, and the whole shape stays a
 * handful of `A` commands rather than a sampled polyline. `faceAt` is the anchor
 * the face group is translated to, picked per shape to sit on the body mass
 * rather than drifting onto a lobe.
 */
const CLOUD_SHAPES = {
  a: {
    d: 'M34 88 A26 26 0 1 1 54.2 40.1 A34 34 0 0 1 120.4 33.6 A28 28 0 0 1 161.2 51.2 A20 20 0 0 1 176.7 88 Z',
    faceAt: '95,63',
  },
  b: {
    d: 'M42.1 88 A26 26 0 0 1 64.2 41.3 A34 34 0 1 1 131.8 41.3 A26 26 0 0 1 153.9 88 Z',
    faceAt: '98,62',
  },
  c: {
    d: 'M25.3 88 A20 20 0 1 1 44.5 53 A26 26 0 0 1 83.8 36 A28 28 0 0 1 134.5 40.9 A24 24 0 0 1 169.5 57.3 A17 17 0 1 1 183.7 88 Z',
    faceAt: '100,64',
  },
  d: {
    d: 'M40.8 88 A22 22 0 0 1 58.3 47.6 A28 28 0 0 1 111.2 39.7 A24 24 0 0 1 146.9 52.7 A20 20 0 0 1 164 88 Z',
    faceAt: '100,64',
  },
  /** Asymmetric tower, rising toward the right. */
  e: {
    d: 'M44.7 88 A24 24 0 0 1 62 44.3 A30 30 0 0 1 105.6 19.3 A24 24 0 0 1 149.6 36.3 A28 28 0 0 1 168.4 88 Z',
    faceAt: '92,66',
  },
  /** Two lobes only — the small, simple puff of the set. */
  f: {
    d: 'M56.1 88 A26 26 0 1 1 90 49.3 A30 30 0 1 1 128.8 88 Z',
    faceAt: '95,66',
  },
  /** Heavy, flat-bottomed storm cloud — the one that rains. */
  g: {
    d: 'M36.4 88 A24 24 0 1 1 56.9 44.6 A30 30 0 0 1 109.3 33.1 A28 28 0 0 1 155.3 47.8 A22 22 0 0 1 173.2 88 Z',
    faceAt: '100,64',
  },
} as const;

type CloudFace = {
  /** Round-capped zero-length segments — each renders as a dot pupil. */
  eyes?: string;
  eyeWidth?: number;
  /** Closed/curved eyelids. Split from `eyes` so the two can carry different pen
   * weights, which is what lets `wink` pair a 7.4 dot with a 3.4 lid. */
  lids?: string;
  brows?: string;
  mouth: string;
  /** Fills the mouth path instead of stroking it, closing an open curve into a
   * solid shape — an open grin or a round "oh". */
  mouthFilled?: boolean;
};

/** Expressions, in coordinates local to a shape's `faceAt` anchor. */
const FACES = {
  happy: { eyes: 'M-13 -2l.01 0M13 -2l.01 0', eyeWidth: 7.4, mouth: 'M-8 5Q0 13 8 5' },
  closed: { lids: 'M-17 1Q-12 -6 -7 1M7 1Q12 -6 17 1', mouth: 'M-5 6Q0 11 5 6' },
  sleepy: { lids: 'M-16 -2Q-11 4 -6 -2M6 -2Q11 4 16 -2', mouth: 'M-4 7Q0 10.5 4 7' },
  oh: {
    eyes: 'M-13 -3l.01 0M13 -3l.01 0',
    eyeWidth: 7.4,
    mouth: 'M0 4a3.4 4.6 0 1 0 .01 0',
    mouthFilled: true,
  },
  wink: {
    eyes: 'M13 -2l.01 0',
    eyeWidth: 7.4,
    lids: 'M-17 -1Q-12 -8 -7 -1',
    mouth: 'M-8 5Q0 13 8 5',
  },
  grin: {
    eyes: 'M-14 -3l.01 0M14 -3l.01 0',
    eyeWidth: 7,
    mouth: 'M-11 4Q0 16 11 4',
    mouthFilled: true,
  },
  sad: {
    eyes: 'M-12 0l.01 0M12 0l.01 0',
    eyeWidth: 6.6,
    /** Inner ends raised — the difference between worried and angry. */
    brows: 'M-19 -9L-8 -13M19 -9L8 -13',
    mouth: 'M-8 11Q0 3 8 11',
  },
} satisfies Record<string, CloudFace>;

/** Teardrop: a point at the origin, straight down into a semicircular bottom. */
const RAINDROP = 'M0 0Q3 5 3 7.4A3 3 0 1 1 -3 7.4Q-3 5 0 0Z';

type FlockMember = {
  /** Offset from the flock's leader, in px. */
  dx: number;
  dy: number;
  width: number;
  /** One full flap cycle: three beats plus a glide. Varied per bird so a flock
   * doesn't beat in lockstep. */
  flap: number;
  /** Phase offset into that flap cycle, so the beats are staggered too. */
  flapShift: number;
  /** Phase offset for the vertical soar, so members wander independently. */
  soar: number;
};

type Flock = {
  /** Vertical position, in % of the viewport. */
  top: number;
  delay: number;
  duration: number;
  /** Where the flock parks when motion is reduced, in % of the viewport width. */
  rest: number;
  members: FlockMember[];
};

/** A cat sitting on the near hill, in the gutter beside the text column. */
type HillCat = {
  name: string;
  /** Jojo is a brown tabby with white, so he also gets a bib, paws and stripes;
   * Vivi is plain grey. */
  tabby: boolean;
  height: number;
  /** Inset from the right edge of the viewport. */
  right: number;
};

type Cloud = {
  art: (typeof CLOUD_SHAPES)[keyof typeof CLOUD_SHAPES];
  face: CloudFace;
  /** Vertical position, in % of the viewport. */
  top: number;
  /** Multiplier on the base width. Sizing is width-driven rather than a CSS
   * `scale()`, because an ancestor transform also shrinks the silhouette's
   * "non-scaling" stroke — which would leave far clouds with a hairline. */
  scale: number;
  /** Drives fill, outline weight and opacity so size isn't the only depth cue. */
  depth: 'near' | 'far';
  /** Negative, so every cloud is already mid-flight on load instead of the sky
   * starting empty and filling up over the next two minutes. */
  delay: number;
  duration: number;
  /** Offsets the vertical bob so the clouds don't rise and fall in lockstep. */
  bob: number;
  /** Where the cloud parks when motion is reduced, in % of the viewport width. */
  rest: number;
  /** Spends most of its cycle parked off-screen rather than drifting the whole
   * time, so it shows up as an occasional event instead of a fixture. */
  rare?: boolean;
  rain?: boolean;
};

@Component({
  selector: 'app-root',
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

  /** `variant` selects one of three distinct twinkle motion signatures
   * (see `.star`/`.star--glint`/`.star--drift` in app.css) so the field
   * reads as varied stars rather than one shape repeated with offsets. */
  protected readonly heroStars: Array<{
    top: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
    variant: 'pulse' | 'glint' | 'drift';
  }> = [
    { top: 8, left: 14, size: 2, delay: 0, duration: 4.6, variant: 'pulse' },
    { top: 16, left: 78, size: 3, delay: 0.6, duration: 5.2, variant: 'glint' },
    { top: 28, left: 46, size: 2, delay: 1.2, duration: 3.8, variant: 'drift' },
    { top: 11, left: 60, size: 2, delay: 1.8, duration: 4.9, variant: 'pulse' },
    { top: 38, left: 22, size: 3, delay: 0.3, duration: 5.6, variant: 'glint' },
    { top: 5, left: 36, size: 2, delay: 2.1, duration: 4.2, variant: 'drift' },
    { top: 21, left: 90, size: 2, delay: 1.4, duration: 3.6, variant: 'pulse' },
    { top: 46, left: 70, size: 2, delay: 0.9, duration: 5.0, variant: 'glint' },
    { top: 14, left: 5, size: 3, delay: 2.6, duration: 4.4, variant: 'drift' },
    { top: 33, left: 55, size: 2, delay: 1.6, duration: 3.9, variant: 'pulse' },
    { top: 3, left: 85, size: 2, delay: 0.4, duration: 4.7, variant: 'glint' },
    { top: 24, left: 30, size: 2, delay: 2.0, duration: 5.4, variant: 'drift' },
  ];

  protected readonly shootingStars: ShootingStar[] = generateShootingStars(3);

  protected readonly flocks: Flock[] = [
    {
      top: 16,
      delay: -4,
      duration: 27,
      rest: 30,
      members: [
        { dx: 0, dy: 0, width: 48, flap: 1.5, flapShift: 0, soar: 0 },
        { dx: -40, dy: -23, width: 42, flap: 1.34, flapShift: -0.52, soar: -1.7 },
        { dx: -43, dy: 21, width: 40, flap: 1.62, flapShift: -0.95, soar: -3.1 },
      ],
    },
    {
      top: 34,
      delay: 13,
      duration: 31,
      rest: 68,
      members: [{ dx: 0, dy: 0, width: 44, flap: 1.44, flapShift: -0.3, soar: -2.2 }],
    },
  ];

  protected readonly hillCats: HillCat[] = [
    { name: 'vivi', tabby: false, height: 56, right: 118 },
    { name: 'jojo', tabby: true, height: 68, right: 40 },
  ];

  protected readonly clouds: Cloud[] = [
    {
      art: CLOUD_SHAPES.a,
      face: FACES.happy,
      top: 8,
      scale: 1,
      depth: 'near',
      delay: -12,
      duration: 118,
      bob: 0,
      rest: 14,
    },
    {
      art: CLOUD_SHAPES.c,
      face: FACES.sleepy,
      top: 21,
      scale: 0.6,
      depth: 'far',
      delay: -95,
      duration: 172,
      bob: -4.5,
      rest: 63,
    },
    {
      art: CLOUD_SHAPES.b,
      face: FACES.closed,
      top: 4,
      scale: 0.72,
      depth: 'far',
      delay: -55,
      duration: 150,
      bob: -9,
      rest: 88,
    },
    {
      art: CLOUD_SHAPES.d,
      face: FACES.oh,
      top: 31,
      scale: 0.88,
      depth: 'near',
      delay: -108,
      duration: 130,
      bob: -2,
      rest: 36,
    },
    {
      art: CLOUD_SHAPES.e,
      face: FACES.wink,
      top: 26,
      scale: 0.78,
      depth: 'near',
      delay: -70,
      duration: 141,
      bob: -11,
      rest: 50,
    },
    {
      art: CLOUD_SHAPES.f,
      face: FACES.grin,
      top: 14,
      scale: 0.52,
      depth: 'far',
      delay: -150,
      duration: 190,
      bob: -6.5,
      rest: 76,
    },
    {
      art: CLOUD_SHAPES.g,
      face: FACES.sad,
      top: 17,
      scale: 0.92,
      depth: 'near',
      // `cloud-drift-rare` parks the cloud until 82% of its cycle, so the drift
      // itself starts at 0.82 * 300s. Offsetting by that lands the first pass a
      // few seconds after load — a rare cloud nobody ever sees is a wasted one —
      // and every pass after that is one per 5-minute cycle.
      delay: randomBetween(8, 45) - 246,
      duration: 300,
      bob: -3,
      rest: 58,
      rare: true,
      rain: true,
    },
  ];

  protected readonly raindropPath = RAINDROP;

  /** Irregular delays so the fall reads as rain rather than a marching wave. */
  protected readonly raindrops = [
    { x: 52, delay: 0 },
    { x: 72, delay: -0.34 },
    { x: 92, delay: -0.13 },
    { x: 112, delay: -0.45 },
    { x: 132, delay: -0.22 },
    { x: 152, delay: -0.07 },
  ];

  protected readonly isNight = signal(true);

  /** Eased 0..1 scroll progress through the page, used to give the nebula a
   * subtle parallax drift/rotation instead of sitting fully static while
   * scrolling (the sky itself is `position: fixed`, so it needs its own cue). */
  protected readonly scrollShift = signal(0);

  private scrollTarget = 0;
  private scrollCurrent = 0;
  private scrollRafId: number | null = null;

  constructor() {
    this.syncDocumentLanguage(this.locale());
    this.initScrollParallax();
    effect(() => this.syncColorScheme(this.isNight()));
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

  /** Keeps the UA-level theme in step with the in-page one. Without this the
   * root `color-scheme` stays `dark` in daylight, so scrollbars, form controls
   * and the mobile browser chrome stay night-colored around a light page. */
  private syncColorScheme(isNight: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.style.colorScheme = isNight ? 'dark' : 'light';
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isNight ? '#05060d' : '#2ea8ec');
  }

  /** Tracks scroll progress (0..1) and eases it toward `scrollShift` on each
   * frame via a self-terminating rAF loop, rather than writing scroll events
   * straight to the signal — this smooths out the parallax so it glides
   * instead of jittering with every scroll tick. */
  private initScrollParallax(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const updateTarget = (): void => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollTarget = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      this.runScrollEasing();
    };

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });
    updateTarget();

    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      if (this.scrollRafId !== null) {
        cancelAnimationFrame(this.scrollRafId);
      }
    });
  }

  private runScrollEasing(): void {
    if (this.scrollRafId !== null) {
      return;
    }

    const step = (): void => {
      const diff = this.scrollTarget - this.scrollCurrent;
      if (Math.abs(diff) < 0.0005) {
        this.scrollCurrent = this.scrollTarget;
        this.scrollShift.set(this.scrollCurrent);
        this.scrollRafId = null;
        return;
      }
      this.scrollCurrent += diff * 0.08;
      this.scrollShift.set(this.scrollCurrent);
      this.scrollRafId = requestAnimationFrame(step);
    };

    this.scrollRafId = requestAnimationFrame(step);
  }
}
