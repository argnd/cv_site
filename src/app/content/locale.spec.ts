import { localeFromPath, localizePath, stripLocale } from './locale';

/**
 * The locale is now carried by the URL and nothing else, so these three
 * functions decide which translation every visitor and every crawler gets.
 * A prefix match that is one character too loose would hand `/enquete` to the
 * English page, and a canonical that disagrees with the rendered language is
 * exactly the kind of mismatch hreflang exists to avoid.
 */
describe('locale', () => {
  describe('localeFromPath', () => {
    it('reads the prefix', () => {
      expect(localeFromPath('/en')).toBe('en');
      expect(localeFromPath('/en/')).toBe('en');
      expect(localeFromPath('/en/project')).toBe('en');
    });

    it('falls back to French for anything unprefixed', () => {
      expect(localeFromPath('/')).toBe('fr');
      expect(localeFromPath('/project')).toBe('fr');
      expect(localeFromPath('/unknown')).toBe('fr');
    });

    it('matches whole segments only', () => {
      expect(localeFromPath('/enquete')).toBe('fr');
      expect(localeFromPath('/entreprise/en')).toBe('fr');
    });
  });

  describe('stripLocale', () => {
    it('removes the prefix and keeps a rooted path', () => {
      expect(stripLocale('/en/project')).toBe('/project');
      expect(stripLocale('/en')).toBe('/');
      expect(stripLocale('/en/')).toBe('/');
      expect(stripLocale('/project')).toBe('/project');
      expect(stripLocale('/')).toBe('/');
    });
  });

  describe('localizePath', () => {
    it('moves a path between locales', () => {
      expect(localizePath('/project', 'en')).toBe('/en/project');
      expect(localizePath('/en/project', 'fr')).toBe('/project');
      expect(localizePath('/', 'en')).toBe('/en');
      expect(localizePath('/en', 'fr')).toBe('/');
    });

    it('is idempotent', () => {
      expect(localizePath('/en/project', 'en')).toBe('/en/project');
      expect(localizePath('/project', 'fr')).toBe('/project');
    });
  });
});
