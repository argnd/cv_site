import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { serverConfig } from './app/app.config.server';

/**
 * The entry the build renders each prerendered route with. The output is
 * static HTML — there is no Node server in production, the files are mirrored
 * onto OVH shared hosting — so this only ever runs at build time.
 *
 * `context` is not optional off the browser: it carries the platform the
 * renderer is running on, and without it bootstrap fails with NG0401.
 */
export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(App, serverConfig, context);
}
