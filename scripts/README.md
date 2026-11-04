# Scripts

- `build.mjs`: runs during deployment. It fills the registry, writes `dist/` and checks every internal link, image, script, stylesheet and instruction file, the manifest, the service worker file list and the colour contrast of every theme.
- `lib/`: colour maths and the theme stylesheet generator used by the build.
- `templates/`: the service worker, the 404 page and the offline page. The build fills in the base path and a version number.
