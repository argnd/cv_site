/**
 * The site is a single scrolling page, but the games section also has its own
 * URL so it can be linked, bookmarked and shared. This module is the whole of
 * that: a path/section mapping, plus the two directions of keeping the two in
 * step — clicking a link updates the URL, and the URL (on load or via the
 * browser's Back button) moves the scroll.
 *
 * Every path here may carry a locale prefix (`/en/project` as well as
 * `/project`), so the section lookup runs on the stripped path and callers
 * pass paths already localized for the locale on screen.
 *
 * Like `animations/scroll-parallax.ts` it imports nothing from Angular. There
 * is no route tree, no outlet and no component to swap, so a real router would
 * be several times the size of this file for no gain.
 */

import { stripLocale } from '../content/locale';

/** The games section's own URL, unprefixed. Localize it before using it as an href. */
export const GAMES_PATH = '/project';

/** Which section each routable path scrolls to, by element id. */
const SECTION_BY_PATH: Record<string, string> = {
  [GAMES_PATH]: 'games',
};

/** The section a URL names, locale prefix and all. */
function sectionFor(pathname: string): string | undefined {
  return SECTION_BY_PATH[stripLocale(pathname)];
}

function prefersReducedMotion(): boolean {
  /* jsdom has no matchMedia, and neither does a server render. */
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Scrolls to whatever `path` names. An unmapped path — i.e. a locale's root —
 * means the top of the page.
 */
function scrollToPath(path: string, behavior: ScrollBehavior): void {
  const sectionId = sectionFor(path);

  if (sectionId === undefined) {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  document.getElementById(sectionId)?.scrollIntoView({ behavior, block: 'start' });
}

/**
 * Records a new URL without moving the page. Used when only the address needs
 * to change — switching locale rewrites the URL but must leave the reader
 * exactly where they were.
 */
export function pushPath(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
}

/**
 * Handles a click on an in-page link: records the new URL and glides to the
 * section. The caller is responsible for `preventDefault()`, since only it
 * knows whether the click was a plain one.
 */
export function navigateToSection(path: string): void {
  pushPath(path);
  scrollToPath(path, prefersReducedMotion() ? 'auto' : 'smooth');
}

/**
 * Honours the URL the page was opened on, then keeps following it through
 * Back and Forward.
 *
 * @param onNavigate Told the new pathname whenever the browser moves through
 *   history. Back out of `/en` is a locale change as well as a scroll, and
 *   only the caller can act on that half.
 * @returns The teardown, to hand to a `DestroyRef`.
 */
export function startSectionRouting(onNavigate: (pathname: string) => void): () => void {
  const onPopState = (): void => {
    const { pathname } = window.location;
    onNavigate(pathname);
    scrollToPath(pathname, prefersReducedMotion() ? 'auto' : 'smooth');
  };

  /* Deep links land instantly rather than gliding: a smooth scroll on first
     paint reads as the page sliding out from under the reader, who never
     asked for the top of the page in the first place. Back/Forward do glide,
     because there the motion is what shows the reader where they went. */
  if (sectionFor(window.location.pathname) !== undefined) {
    scrollToPath(window.location.pathname, 'auto');
  }

  window.addEventListener('popstate', onPopState);
  return () => window.removeEventListener('popstate', onPopState);
}
