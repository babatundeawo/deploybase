# Customizing guide

Make every change in GitHub Desktop (edit the file in File Explorer, then commit and push) or on the GitHub website (open the file, click the pencil, **Commit changes**). See `DEPLOYMENT.md` for the steps and how to check the result.

## Change colours

All colours live in **`data/themes.json`**. There is one block for the hub (`deploybase`) and one for each project, named after its folder. Inside each block the `light` section holds the colours:

```json
"primary": "#3355ff",   // buttons, links, highlights
"accent": "#7c5cff",    // supporting colour
"ink": "#12161f",       // main text
"bg": "#f6f7fb",        // page background
```

The dark theme is worked out from these automatically. To set a dark colour by hand, add a `dark` section to that block with the colours you want to replace.

When you commit, the build checks that every text and background pair is readable (a ratio of at least 4.5). If one is too weak, the run shows a yellow warning that names the theme and the pair. Make that colour darker or lighter.

`assets/css/site.css` holds the shared spacing, type sizes and components. Most people never need to touch it.

## Change text

Open the page's `index.html` (for example `social-content-engine/index.html`) and edit the words between the tags. Do not remove the tags themselves (the parts inside `<` and `>`). Use a normal hyphen instead of long dashes to match the house style.

The cards and the ledger on the home page come from `data/projects.json`. Edit the `name`, `role`, `summary` or `stack` of an entry there.

## Change images and icons

- **Social preview pictures** (shown when a link is shared) are in `assets/img/og/`, one per page, named after the folder. They are 1200 by 630 pixels. Replace one by saving a new picture with exactly the same file name.
- **App icons** are `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` (180 by 180) and, in `assets/img/`, `icon-192.png` (192 by 192), `icon-512.png` (512 by 512) and `icon-maskable-512.png` (512 by 512, with the logo kept inside the middle 80 percent so phones can crop it into a circle or rounded square). Keep the file names and sizes.
- **Install screenshots** are `assets/img/screenshot-wide.png` (1280 by 720) and `screenshot-narrow.png` (540 by 960). They appear in the richer install prompt on Android.

## Change fonts

Fonts are saved on the site itself (folder `assets/fonts/`), so nothing is loaded from Google. To change a font:

1. Download the font as WOFF2 from https://fontsource.org (choose the variable version where there is one). Save it in `assets/fonts/`.
2. Add a line to `assets/css/fonts.css`, copying one of the existing lines and changing the name and file.
3. In `data/themes.json` change `head` (headings) or `body` (paragraphs) for that project to the new font name.
4. In the project's `index.html`, change the two `rel="preload"` lines near the top so they name the new font files.

Only use fonts whose licence allows websites, and add them to the Credits in `README.md`.

## Add a new project

1. Create the folder and file `my-new-project/index.html`. Open `techbase-code-coach/index.html`, copy everything, and paste it in. Edit the words, the `title`, the `description`, the `canonical` address, the social preview addresses and the `data-theme` name in the first lines.
2. Put the instruction files in `my-new-project/files/`. In the page, the lines starting `data-src="files/..."` and `href="files/..."` must match your file names.
3. In `data/themes.json`, copy a project's block, rename it `my-new-project`, and change the colours and fonts. Do not use a font that is not in `assets/fonts/`.
4. In `data/projects.json`, copy the last entry, add a comma after the one above it, and fill in the new details:

```json
{
  "id": "AGENT.08",
  "status": "active",
  "name": "My New Project",
  "role": "What it is",
  "summary": "One or two sentences on what it does and who it serves.",
  "stack": ["First tag", "Second tag"],
  "href": "my-new-project/",
  "external": false,
  "theme": "my-new-project"
}
```

5. Commit. The build adds the card and ledger row to the home page, adds the page to `sitemap.xml`, makes the theme styles and checks every link. If something is wrong, the Actions tab shows a red cross with a plain message.

Use `status` of `active` for a Claude Project write-up and `tool` for a live tool that people use directly.

## Placeholders and content you should check

Nothing in this site is invented. Two things are worth a look:

- The numbers on each project page (for example the key figures row) were written by you earlier. Check they are still true.
- `docs/assets/preview-hub.png` and `preview-project.png` are screenshots for the README. Replace them if the design changes.
