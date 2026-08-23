import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

/**
 * The browser config plus server rendering. No `withRoutes()`: the site has no
 * router, so there is no route tree to describe. The URLs to render are listed
 * in `prerender-routes.txt` instead — that file takes one bare path per line
 * and has no comment syntax, so its reasoning lives here: each locale needs
 * its own file for hreflang to have somewhere to point, and `/project` needs
 * one so that sharing the deep link serves real markup rather than an empty
 * shell.
 */
const serverOnly: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const serverConfig = mergeApplicationConfig(appConfig, serverOnly);
