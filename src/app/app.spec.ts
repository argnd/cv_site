import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
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

  it('should describe the page in the detected locale', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    /* jsdom reports navigator.language === 'en-US', so detectLocale() picks
       English here — which is what the head should then say. */
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toContain('Senior Java / Angular Developer');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(
      'Spring Batch',
    );
    expect(document.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe(
      'en_US',
    );
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toContain(
      'Senior Java / Angular Developer',
    );
  });
});
