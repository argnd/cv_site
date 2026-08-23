# CvSite

Personal portfolio site of Armel Gandour. Copyright (c) 2026 Armel Gandour, all
rights reserved — see [LICENSE](LICENSE).

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.5.

## Project structure

```
src/app/
  app.ts / app.html / app.css     shell: locale, day/night skin, page column
  models/                         the shapes: content.models.ts, scene.models.ts
  content/                        localized copy (JSON) + locale detection
  animations/                     the decorative sky
    cloud-art.ts                  cloud silhouettes and faces (SVG paths)
    clouds.ts birds.ts            per-element placement and timing tables
    stars.ts  hills.ts
    scroll-parallax.ts            eased rAF loop feeding `--scroll-shift`
    styles/*.css                  one stylesheet per scenery system
  navigation/                     `/project` <-> the games section, no router
  components/                     one component per page section
```

`animations/styles/` is pulled in through `styleUrls` on `App`, in an order that
matters at both ends: `app.css` defines the theme tokens the scenery reads, and
`reduced-motion.css` strips motion back out of everything before it.

Nothing under `animations/` imports Angular — the data is inert, and the motion
itself is CSS keyframes.

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

The app is a fully static SPA, so it only needs a file host. `.github/workflows/deploy.yml`
builds it on every push to `main` and mirrors `dist/cv-site/browser/` onto the hosting over
SFTP with `lftp` (OVHcloud shared hosting does not implement explicit FTPS — `AUTH TLS`
comes back as `500 This security scheme is not implemented`).

Required repository secrets (`Settings > Secrets and variables > Actions`):

| Secret | Value |
| --- | --- |
| `OVH_FTP_SERVER` | `ftp.clusterXXX.hosting.ovh.net` (OVHcloud panel, `FTP - SSH` tab) |
| `OVH_FTP_USERNAME` | FTP login — must be the **main** user, secondary users have no SSH/SFTP access |
| `OVH_FTP_PASSWORD` | FTP password |

Optional settings:

| Name | Kind | Purpose |
| --- | --- | --- |
| `OVH_SSH_KNOWN_HOSTS` | secret | `ssh-keyscan ftp.clusterXXX.hosting.ovh.net` output, pinned so the deploy cannot be MITM'd. Without it the workflow trusts whatever key the server presents and logs a warning. |
| `OVH_FTP_SERVER_DIR` | variable | Target folder, defaults to `www/` |
| `OVH_SFTP_PORT` | variable | SFTP port, defaults to `22` |

The mirror deletes remote files that no longer exist in the build, so `OVH_FTP_SERVER_DIR`
must point at a folder the site owns exclusively.

`public/.htaccess` ships with the build and handles the HTTPS redirect, the SPA fallback,
compression and cache headers on OVH's Apache 2.4.

Use `Actions > Deploy to OVH > Run workflow` with `dry_run` enabled to preview a deploy
without uploading anything.

## License

Proprietary — Copyright (c) 2026 Armel Gandour. All rights reserved. The source,
design and content of this repository may not be used, copied, modified or
redistributed without prior written consent. See [LICENSE](LICENSE) for the full
terms. Third-party dependencies keep their own licenses.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
