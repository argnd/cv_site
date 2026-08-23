import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

/**
 * The site is a single scrolling page with no routes, so no router is wired up.
 * The one in-page jump (hero -> games) is a `scrollIntoView` in
 * `hero-section.component.ts`.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
};
