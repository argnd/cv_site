/**
 * Everything the `<head>` says about the page, kept in step with the active
 * locale: the language attribute, the title, the descriptions link previews
 * read, and the canonical / hreflang tags that tell search engines how the
 * French and English versions relate.
 *
 * Written against a `Document` handed in rather than the global one, because
 * this also runs during prerendering — where there is no global `document`,
 * and the injected one *is* the head being written into the file a crawler
 * will eventually read. That is the entire point of the module.
 *
 * Like `navigation/section-route.ts`, it imports nothing from Angular.
 */

import { INDEXED_LOCALES, localizePath, X_DEFAULT_LOCALE } from '../content/locale';
import { siteContent } from '../content/site-content';
import { SupportedLocale } from '../models/content.models';

/** Canonical and hreflang URLs must be absolute, so they need the origin spelled out. */
export const SITE_ORIGIN = 'https://armelgandour.fr';

/** The indexed URL for a locale's home page. */
function homeUrl(locale: SupportedLocale): string {
  return `${SITE_ORIGIN}${localizePath('/', locale)}`;
}

export function syncDocumentHead(doc: Document, locale: SupportedLocale): void {
  const { title, description, openGraphLocale } = siteContent(locale).appShell.documentMeta;

  doc.documentElement.lang = locale;
  doc.title = title;

  setMeta(doc, 'name', 'description', description);
  setMeta(doc, 'property', 'og:title', title);
  setMeta(doc, 'property', 'og:description', description);
  setMeta(doc, 'property', 'og:locale', openGraphLocale);
  setMeta(doc, 'name', 'twitter:title', title);
  setMeta(doc, 'name', 'twitter:description', description);

  /* Points at the locale's home page rather than the current URL: `/project`
     is the same document as `/`, only scrolled, so it consolidates onto `/`
     instead of competing with it for identical content. */
  const canonical = homeUrl(locale);
  setMeta(doc, 'property', 'og:url', canonical);
  setLink(doc, 'canonical', null, canonical);

  /* An hreflang cluster has to name every version *including this one*, and
     each version has to advertise the same set, or Google discards the lot
     and the two pages compete instead of pairing up. */
  for (const alternate of INDEXED_LOCALES) {
    setLink(doc, 'alternate', alternate, homeUrl(alternate));

    if (alternate !== locale) {
      const alternateMeta = siteContent(alternate).appShell.documentMeta;
      setMeta(doc, 'property', 'og:locale:alternate', alternateMeta.openGraphLocale);
    }
  }

  setLink(doc, 'alternate', 'x-default', homeUrl(X_DEFAULT_LOCALE));
}

function setMeta(
  doc: Document,
  attribute: 'name' | 'property',
  key: string,
  content: string,
): void {
  upsert(doc, 'meta', `meta[${attribute}="${key}"]`, (tag) =>
    tag.setAttribute(attribute, key),
  ).setAttribute('content', content);
}

/**
 * `hreflang` is the discriminator between otherwise identical `alternate`
 * links; `null` means the tag is identified by its `rel` alone, which is how
 * the canonical link is addressed.
 */
function setLink(doc: Document, rel: string, hreflang: string | null, href: string): void {
  const selector =
    hreflang === null ? `link[rel="${rel}"]` : `link[rel="${rel}"][hreflang="${hreflang}"]`;

  upsert(doc, 'link', selector, (tag) => {
    tag.setAttribute('rel', rel);
    if (hreflang !== null) {
      tag.setAttribute('hreflang', hreflang);
    }
  }).setAttribute('href', href);
}

/**
 * Finds the tag `selector` names, creating and appending it if it is missing.
 *
 * The hit is checked for truthiness rather than against `null`: this also runs
 * against the server-side DOM used for prerendering, whose `querySelector`
 * answers `undefined` rather than `null` for a miss — and a `!== null` test
 * would hand that straight back to the caller as if it were an element.
 */
function upsert(
  doc: Document,
  tagName: 'meta' | 'link',
  selector: string,
  initialize: (tag: Element) => void,
): Element {
  const existing = doc.head.querySelector(selector);
  if (existing) {
    return existing;
  }

  const created = doc.createElement(tagName);
  initialize(created);
  doc.head.appendChild(created);
  return created;
}
