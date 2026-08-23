/**
 * The site is a single scrolling page, but the games section also has its own
 * URL so it can be linked, bookmarked and shared. This module is the whole of
 * that: a path/section mapping, plus the two directions of keeping the two in
 * step — clicking a link updates the URL, and the URL (on load or via the
 * browser's Back button) moves the scroll.
 *
 * Like `animations/scroll-parallax.ts` it imports nothing from Angular. There
 * is no route tree, no outlet and no component to swap, so a real router would
 * be several times the size of this file for no gain.
 */

/** The games section's own URL. */
export const GAMES_PATH = '/project';

/** Which section each routable path scrolls to, by element id. */
const SECTION_BY_PATH: Record<string, string> = {
  [GAMES_PATH]: 'games',
};

function prefersReducedMotion(): boolean {
  /* jsdom has no matchMedia, and neither does a server render. */
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Scrolls to whatever `path` names. An unmapped path — i.e. the root — means
 * the top of the page.
 */
function scrollToPath(path: string, behavior: ScrollBehavior): void {
  const sectionId = SECTION_BY_PATH[path];

  if (sectionId === undefined) {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  document.getElementById(sectionId)?.scrollIntoView({ behavior, block: 'start' });
}

/**
 * Handles a click on an in-page link: records the new URL and glides to the
 * section. The caller is responsible for `preventDefault()`, since only it
 * knows whether the click was a plain one.
 */
export function navigateToSection(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }

  scrollToPath(path, prefersReducedMotion() ? 'auto' : 'smooth');
}

/**
 * Honours the URL the page was opened on, then keeps following it through
 * Back and Forward.
 *
 * @returns The teardown, to hand to a `DestroyRef`.
 */
export function startSectionRouting(): () => void {
  const onPopState = (): void => {
    scrollToPath(window.location.pathname, prefersReducedMotion() ? 'auto' : 'smooth');
  };

  /* Deep links land instantly rather than gliding: a smooth scroll on first
     paint reads as the page sliding out from under the reader, who never
     asked for the top of the page in the first place. Back/Forward do glide,
     because there the motion is what shows the reader where they went. */
  if (SECTION_BY_PATH[window.location.pathname] !== undefined) {
    scrollToPath(window.location.pathname, 'auto');
  }

  window.addEventListener('popstate', onPopState);
  return () => window.removeEventListener('popstate', onPopState);
}
