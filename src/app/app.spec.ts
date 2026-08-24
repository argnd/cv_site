import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  /* One test navigates to /en, and the URL is where the locale is read from —
     leaving it there would decide the locale of whichever test ran next. */
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render profile name', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Armel Gandour');
  });

  /* The page renders client-side, so its markup is all a crawler ever gets.
     These two guard the parts of it that exist for search engines and that a
     later refactor would otherwise be free to quietly undo. */
  it('should keep the collapsed about copy in the DOM', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const panel = compiled.querySelector('#about-expanded-content');
    expect(panel?.classList.contains('about__content--collapsed')).toBe(true);
    expect(panel?.textContent).toContain('Spring Batch');
    expect(compiled.querySelector('.about__toggle')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should describe the page in the locale the URL asks for', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    /* jsdom serves the app at `/`, which is the French URL. The browser's own
       language preference is deliberately not consulted — see content/locale.ts. */
    expect(document.documentElement.lang).toBe('fr');
    expect(document.title).toContain('Développeur Senior Java');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'Spring Batch',
    );
    expect(document.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe(
      'fr_FR',
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://armelgandour.fr/',
    );
  });

  it('should advertise the full hreflang cluster', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const alternates = Array.from(document.querySelectorAll('link[rel="alternate"]')).map(
      (link) => [link.getAttribute('hreflang'), link.getAttribute('href')],
    );

    /* Every version must name the whole set, itself included, or Google drops
       the cluster and the two translations compete instead of pairing up. */
    expect(alternates).toEqual([
      ['fr', 'https://armelgandour.fr/'],
      ['en', 'https://armelgandour.fr/en'],
      ['x-default', 'https://armelgandour.fr/'],
    ]);
  });

  /* Switching language is a navigation now: each locale is its own indexed URL,
     so the address bar, the copy and the head tags all have to move together or
     a shared link hands the reader back the language they just left. */
  it('should navigate to /en when English is chosen', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const [, englishButton] = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('.locale-selector__option'),
    );
    englishButton.click();
    await fixture.whenStable();

    expect(window.location.pathname).toBe('/en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toContain('Senior Java / Angular Developer');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://armelgandour.fr/en',
    );
    expect(compiled.querySelector('.hero__headline')?.textContent).toContain('Senior Java 21');
    expect(compiled.querySelector('.hero__actions a:last-of-type')?.getAttribute('href')).toBe(
      '/en/project',
    );
  });

  /* The neutral skin hangs nothing in its sky, so the nudge beside the toggle is
     the only thing on screen saying the other two exist — and the toggle is the
     only way to reach them. Both are easy to lose in a refactor of the control. */
  it('should open on the neutral skin, offer three, and drop the nudge once one is picked', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const options = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('.theme-toggle__option'),
    );
    expect(compiled.querySelector('.scene')?.classList.contains('is-slate')).toBe(true);
    expect(options.map((option) => option.getAttribute('aria-pressed'))).toEqual([
      'true',
      'false',
      'false',
    ]);
    expect(compiled.querySelector('.theme-hint')).not.toBeNull();

    const [, nightOption, dayOption] = options;
    nightOption.click();
    await fixture.whenStable();

    expect(compiled.querySelector('.scene')?.classList.contains('is-night')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
    /* Said once. A reader who has used the control does not need telling. */
    expect(compiled.querySelector('.theme-hint')).toBeNull();

    dayOption.click();
    await fixture.whenStable();

    expect(compiled.querySelector('.scene')?.classList.contains('is-day')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });
});
