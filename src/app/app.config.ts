import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

/**
 * The site is a single scrolling page with no routes, so no router is wired up.
 * The one in-page jump (hero -> games) is a `scrollIntoView` in
 * `navigation/section-route.ts`.
 *
 * Hydration reuses the prerendered DOM instead of throwing it away and
 * rebuilding, which is what keeps the sky from flashing on load. It is safe
 * here because the scenery only randomizes *values* — `createClouds()` and
 * `createShootingStars()` always emit the same number of elements, so the
 * server and browser trees match structurally and only style bindings differ.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideClientHydration()],
};
