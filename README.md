# CvSite

Personal portfolio site of Armel Gandour. Copyright (c) 2026 Armel Gandour, all
rights reserved — see [LICENSE](LICENSE).

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.5.

## Project structure

```
src/app/
  app.ts / app.html / app.css     shell: locale, day/night skin, page column
  models/                         the shapes: content.models.ts, scene.models.ts
  content/                        localized copy (JSON) + the URL <-> locale rules
  animations/                     the decorative sky
    cloud-art.ts                  cloud silhouettes and faces (SVG paths)
    clouds.ts birds.ts            per-element placement and timing tables
    stars.ts  hills.ts
    scroll-parallax.ts            rAF loop feeding `--scroll-shift`
    styles/*.css                  one stylesheet per scenery system
  navigation/                     `/project` <-> the games section, no router
  seo/                            title, description, canonical and hreflang tags
  components/                     one component per page section
src/main.server.ts                render entry, build time only
prerender-routes.txt              the URLs that get their own HTML file
```

`animations/styles/` is pulled in through `styleUrls` on `App`, in an order that
matters at both ends: `app.css` defines the theme tokens the scenery reads, and
`reduced-motion.css` strips motion back out of everything before it.

Nothing under `animations/` imports Angular — the data is inert, and the motion
itself is CSS keyframes. `navigation/` and `seo/` follow the same rule.

## Languages and URLs

The site is bilingual, and the locale lives in the URL rather than in
`navigator.language`:

| URL                          | Language                                         |
| ---------------------------- | ------------------------------------------------ |
| `/`                          | French                                           |
| `/en`                        | English                                          |
| `/project` and `/en/project` | the same pages, scrolled to the projects section |

Each language is prerendered to its own file and carries its own `canonical`,
so search engines can index both and pair them through `hreflang`. Reading the
locale from the browser instead would leave `/` rendering English while its tags
still claimed French, and Google warns that redirecting on the browser's
language can stop a version from being crawled at all. Visitors choose with the
locale selector, which navigates between the two URLs.

`/project` and `/en/project` canonicalize back to their locale's home page:
same document, different scroll position.

Adding a language means adding its prefix in `content/locale.ts`, its copy in
`content/*.json`, and its URLs to `prerender-routes.txt`.

## Rendering

The build prerenders (SSG) every URL in `prerender-routes.txt` to a static HTML
file, then hydrates in the browser. There is no Node server in production — the
output is plain files on shared hosting.

This matters because the page is otherwise invisible to anything that does not
run JavaScript. Before prerendering the served `<body>` was an empty
`<app-root>`: Bing, DuckDuckGo, LinkedIn and every social preview crawler saw no
heading, no skills and no experience.

`prerender-routes.txt` takes one bare path per line and supports no comment
syntax — a `#` line is treated as a route and fails the build.

Hydration is safe here even though the sky is randomized: `createClouds()` and
`createShootingStars()` vary only style values, never the number of elements, so
the server and browser trees match structurally.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment (OVHcloud shared hosting)

The app is a fully static site, so it only needs a file host. `.github/workflows/deploy.yml`
builds it on every push to `main` and mirrors `dist/cv-site/browser/` onto the hosting over
SFTP with `lftp` (OVHcloud shared hosting does not implement explicit FTPS — `AUTH TLS`
comes back as `500 This security scheme is not implemented`).

Required repository secrets (`Settings > Secrets and variables > Actions`):

| Secret             | Value                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| `OVH_FTP_SERVER`   | `ftp.clusterXXX.hosting.ovh.net` (OVHcloud panel, `FTP - SSH` tab)             |
| `OVH_FTP_USERNAME` | FTP login — must be the **main** user, secondary users have no SSH/SFTP access |
| `OVH_FTP_PASSWORD` | FTP password                                                                   |

Optional settings:

| Name                  | Kind     | Purpose                                                                                                                                                                         |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OVH_SSH_KNOWN_HOSTS` | secret   | `ssh-keyscan ftp.clusterXXX.hosting.ovh.net` output, pinned so the deploy cannot be MITM'd. Without it the workflow trusts whatever key the server presents and logs a warning. |
| `OVH_FTP_SERVER_DIR`  | variable | Target folder, defaults to `www/`                                                                                                                                               |
| `OVH_SFTP_PORT`       | variable | SFTP port, defaults to `22`                                                                                                                                                     |

The mirror deletes remote files that no longer exist in the build, so `OVH_FTP_SERVER_DIR`
must point at a folder the site owns exclusively.

`public/.htaccess` ships with the build and handles the HTTPS redirect, serving each
prerendered page without a trailing-slash redirect, compression and cache headers on
OVH's Apache 2.4.

`public/robots.txt` blocks AI crawlers in two groups — training and assistant/search —
so the second can be re-allowed on its own if appearing in AI answers becomes worth more
than the traffic it diverts.

Use `Actions > Deploy to OVH > Run workflow` with `dry_run` enabled to preview a deploy
without uploading anything.

## License

Proprietary — Copyright (c) 2026 Armel Gandour. All rights reserved. The source,
design and content of this repository may not be used, copied, modified or
redistributed without prior written consent. See [LICENSE](LICENSE) for the full
terms. Third-party dependencies keep their own licenses.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
