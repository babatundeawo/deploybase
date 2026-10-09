# Customizing guide

Every change here is made on the GitHub website: open a file, click the pencil icon, edit, then click **Commit changes**. See `DEPLOYMENT.md` for the full steps and how to check the result.

## Change colours

**The home page** uses the values at the very top of `assets/css/site.css`, inside the block that starts with `:root {`. The main ones:

```css
--primary: #3355ff;   /* the blue used for buttons and links */
--accent: #7c5cff;    /* the supporting violet */
--ink: #12161f;       /* main text */
--bg: #f6f7fb;        /* page background */
```

**A project page** has its own block in `assets/css/themes.css`. Find the block named after the folder, for example `[data-theme="classpulse-national"]`, and change the colour codes inside it. The colour of that project's card on the home page changes with it.

Keep text colours dark against light backgrounds. A good check is https://webaim.org/resources/contrastchecker/ (aim for a ratio of 4.5 or higher).

## Change text

Open the page's `index.html` (for example `social-content-engine/index.html`) and edit the words between the tags. Do not remove the tags themselves (the parts inside `<` and `>`). Use a normal hyphen instead of long dashes to match the house style.

The cards on the home page come from `data/projects.json`. Edit the `name`, `role`, `summary` or `stack` of an entry there.

## Change images and icons

- Social preview pictures (shown when a link is shared) are in `assets/img/og/`, one per page, named after the folder. They are 1200 by 630 pixels. To replace one, open the folder, click **Add file > Upload files** and upload a new picture with exactly the same file name.
- App icons are `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` and the files in `assets/img/`. Replace them the same way, keeping the file names and sizes.

## Change fonts

Each page loads its fonts from the line in the `<head>` that starts with `<link rel="stylesheet" href="https://fonts.googleapis.com/...`. To use a different Google font:

1. Go to https://fonts.google.com, choose a font, and copy the link it gives you.
2. Replace the `href` address in that line.
3. In `assets/css/themes.css`, change the font name next to `--font-head` (headings) or `--font-body` (paragraphs) in that project's block.

## Add a new project

1. Click **Add file > Create new file**. In the name box type `my-new-project/index.html` (the `/` creates the folder).
2. Open `techbase-code-coach/index.html`, copy everything, and paste it into the new file. Edit the words, the `title`, the `description`, the `canonical` address and the `data-theme` name in the first lines.
3. Upload the instruction files into `my-new-project/files/` with **Add file > Upload files**. In the page, the lines starting `data-src="files/..."` and `href="files/..."` must match your file names.
4. In `assets/css/themes.css`, copy a project's two blocks to the end of the file and change the name in `data-theme` to `my-new-project`, then change the colours and fonts.
5. In `data/projects.json`, copy the last entry, add a comma after the one above it, and fill in the new details. The `href` is `my-new-project/`, `external` is `false`, and `theme` is `my-new-project`:

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

6. Commit. The build adds the card to the home page, adds the page to `sitemap.xml` and checks all the links. If something is wrong, the Actions tab shows a red cross with a plain message.

Use `status` of `active` for a Claude Project write-up and `tool` for a live tool that people use directly.
