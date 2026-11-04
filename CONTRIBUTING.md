# Contributing

Thank you for helping. Small fixes are welcome: typos, broken links, accessibility problems and layout bugs.

## Run it locally

You need [Node.js](https://nodejs.org) 22 or newer. There are no packages to install.

```
node scripts/build.mjs
```

This fills in the registry, writes the generated files into `dist/` and checks every link, the manifest and the service worker file list. To look at the result, serve `dist/` from any static server at the path in `site.url` inside `data/projects.json` (for example `/deploybase/`), because the service worker and the 404 page use that base path.

## Before you open a pull request

1. Run the build and make sure it finishes with no errors.
2. Check the page at 320px and 1280px wide, in light and dark.
3. Check it with the keyboard only.
4. Do not add third-party scripts, fonts or trackers. The Content Security Policy allows this site's own files only.

The site owner does not need any of this. The owner guides are in [docs/](docs/).
