import { SupportedLocale } from '../models/content.models';

/** Used when the browser doesn't ask for anything, or asks for French. */
const DEFAULT_LOCALE: SupportedLocale = 'fr';

/**
 * Picks the locale from the browser's language preferences. French is the
 * default: anything that isn't an explicit French preference falls back to the
 * English translation.
 */
export function detectLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const browserLocales =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];
  return browserLocales.some((locale) => locale.toLowerCase().startsWith('fr'))
    ? DEFAULT_LOCALE
    : 'en';
}
