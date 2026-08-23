import { SupportedLocale } from '../models/content.models';

/**
 * The locale served at the site root. Every URL without a locale prefix means
 * this one, so it doubles as the fallback for anything unrecognized.
 */
const DEFAULT_LOCALE: SupportedLocale = 'fr';

/**
 * The URL prefix that carries each locale. The default gets none, so the
 * French pages keep the bare URLs they have always had and no existing link
 * breaks.
 */
const LOCALE_PREFIX: Record<SupportedLocale, string> = {
  fr: '',
  en: '/en',
};

/** The locales that are actually spelled out in a URL. */
const PREFIXED_LOCALES = (Object.keys(LOCALE_PREFIX) as SupportedLocale[]).filter(
  (locale) => locale !== DEFAULT_LOCALE,
);

/** True when `pathname` *is* the prefix or sits below it — `/enquete` is neither. */
function hasPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Which translation a URL asks for: `/en` and everything under it is English,
 * everything else French.
 *
 * Deliberately not `navigator.language`. Each translation is prerendered at
 * its own URL and carries its own canonical, so the URL has to be the single
 * source of truth — picking the locale from the browser instead would let `/`
 * render English while its canonical and hreflang tags still claimed French.
 * Google also warns that redirecting on the browser's language can stop a
 * version from being crawled at all. The visitor chooses with the locale
 * selector, and hreflang is what advertises the choice to search engines.
 */
export function localeFromPath(pathname: string): SupportedLocale {
  return (
    PREFIXED_LOCALES.find((locale) => hasPrefix(pathname, LOCALE_PREFIX[locale])) ?? DEFAULT_LOCALE
  );
}

/** `pathname` with its locale prefix removed: `/en/project` -> `/project`. */
export function stripLocale(pathname: string): string {
  const rest = pathname.slice(LOCALE_PREFIX[localeFromPath(pathname)].length);
  return rest === '' ? '/' : rest;
}

/** The same page addressed in `locale`: `/project` + `en` -> `/en/project`. */
export function localizePath(pathname: string, locale: SupportedLocale): string {
  const path = stripLocale(pathname);
  const prefix = LOCALE_PREFIX[locale];
  return path === '/' ? prefix || '/' : `${prefix}${path}`;
}

/** Every locale that gets an indexed URL of its own, for hreflang and the sitemap. */
export const INDEXED_LOCALES: readonly SupportedLocale[] = ['fr', 'en'];

/** What `hreflang="x-default"` points at: the version served to everyone else. */
export const X_DEFAULT_LOCALE = DEFAULT_LOCALE;
