# Assets

Shared files used by every page.

- `css/site.css`: the design system (colour tokens, type scale, spacing, components, motion).
- `css/fonts.css`: the `@font-face` rules for the self-hosted fonts.
- `fonts/`: the font files (WOFF2, Latin subset, SIL Open Font License).
- `js/theme-init.js`: applies the saved light or dark choice before the page paints.
- `js/site.js`: navigation, theme toggle, copy buttons, file viewer, install prompt, offline notice and service worker registration.
- `js/redirect.js`: the soft redirect used by pages that have moved.
- `img/`: app icons, install screenshots and the social preview image for each page.

`css/themes.css` is not in this folder. The build writes it from `data/themes.json`.
