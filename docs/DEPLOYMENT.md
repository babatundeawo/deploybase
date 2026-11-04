# Deployment guide

This guide is for the site owner. You never need a terminal. Everything is a click in GitHub Desktop, File Explorer or the GitHub website.

## How deployment works, in plain words

GitHub stores your files. Each time a change reaches the **main** branch, a robot called **GitHub Actions** wakes up, builds the site, checks that no link is broken, and publishes it at https://babatundeawo.github.io/deploybase/. This takes one to two minutes. You never press a "publish" button yourself.

GitHub Pages on the free plan needs a **public** repository. This one is public. If you ever make it private, the live site stops updating.

## Putting this redesign live (one time)

The redesign arrives as a **pull request** (a proposed change that waits for you to approve it). The live site does not change until you merge it.

1. Open https://github.com/babatundeawo/deploybase/pulls and click the pull request named **Premium redesign**.
2. Scroll to the bottom. You should see green ticks next to **Build and check**. A red cross means something failed: see "How to read an error" below.
3. **To look at it before you merge:** click the **Checks** tab, click **Check pull request** on the left, scroll to **Artifacts**, and click **built-site**. A ZIP downloads. Extract it, open the folder, and double-click `index.html`. Fonts, colours and pages show. The install and offline features only work on the real live address, so they cannot be tested from this copy.
4. When you are happy, click the green **Merge pull request** button, then **Confirm merge**.
5. Click the **Actions** tab. A new row called **Deploy site** appears. Wait for the green tick (about two minutes).
6. Open https://babatundeawo.github.io/deploybase/ and press **Ctrl + F5** once to skip the old saved copy.

GitHub Pages has no built-in preview for a pull request. Your two options are the one above (download and look) or merge and rely on the easy rollback below.

## One-time check: Pages must use GitHub Actions

1. Click **Settings**, then **Pages** in the left menu.
2. Under **Build and deployment**, **Source** must say **GitHub Actions**. If it says **Deploy from a branch**, change it.

## Switch on the free security scanners (one time)

1. Click **Settings**, then **Code security** (on some accounts **Advanced security**).
2. Switch on **Dependabot alerts**, **Secret scanning** and **Push protection**.

You should see each one show as **Enabled**.

## Updating content day to day

### With GitHub Desktop

1. Open GitHub Desktop and choose the **deploybase** repository. Click **Fetch origin**, then **Pull origin** if it appears.
2. Open the repository folder in File Explorer (**Repository > Show in Explorer**) and change the file, or replace images and files.
3. Go back to GitHub Desktop. You should see your changed files listed on the left.
4. In the **Summary** box type what you changed, for example `Update the Social Content Engine summary`.
5. Click **Commit to main**, then **Push origin**.

If you cannot see the `.github` folder in File Explorer: click **View**, then **Show**, then tick **Hidden items**.

### On the GitHub website

1. Open the file on GitHub, click the pencil icon, make the change.
2. Click **Commit changes**, then **Commit changes** again.

### The safer way

In GitHub Desktop click **Current Branch**, then **New Branch**, name it (for example `update-summary`), make your change, commit, click **Publish branch**, then **Create Pull Request**. GitHub runs the checks and gives you a downloadable copy. Nothing goes live until you merge.

## How to check that a deployment worked

1. Click the **Actions** tab.
2. Look at the top row.
   - A **green tick** means the site is live.
   - A **yellow circle** means it is working. Wait a minute.
   - A **red cross** means something failed, and the live site stays on the last good version.
3. To find the address, click the row, then click **Publish**. The address is shown under it.

## How to read an error

1. Click the row with the red cross.
2. Click the red job name on the left (for example **Build and check**).
3. Click the step with the red cross. The message is in plain words:

| Message | What it means | Fix |
| --- | --- | --- |
| `points to a file that does not exist` | A link, image or file name is misspelled, or the file was not uploaded | Fix the spelling in the file named at the start of the message, or add the missing file |
| `points to a section (#...) that does not exist` | A link to a part of a page uses a name that is not on that page | Check the `id` or the link name |
| `is missing "..."` or `is used twice` | An entry in `data/projects.json` is incomplete or repeated | Fix that entry |
| `there is no theme called "..."` | A project uses a theme that is not in `data/themes.json` | Add the theme, or fix the name |
| `manifest.webmanifest: ... does not exist` | An icon or screenshot named in the manifest is missing | Add the file or remove the entry |
| `Get Pages site failed` or `HttpError: Not Found` | GitHub Pages is not switched on | Do the Pages check above |

Warnings (yellow) do not stop a deployment. The Lighthouse report and the HTML check are score cards, never gates.

## How to roll back

If something is wrong after a merge, undo it:

1. Click **Pull requests**, then **Closed**, and open the pull request you merged.
2. Near the bottom of the page click **Revert**. GitHub prepares a new pull request that undoes the change.
3. Click **Create pull request**, wait for the green ticks, then click **Merge pull request** and **Confirm merge**.
4. Wait for **Deploy site** to show a green tick on the **Actions** tab.

For a change that was committed directly (not through a pull request): click **Commits**, click the commit, click the three dots at the top right, choose **Revert**, and follow the same steps.

## Install it on a phone and test offline

1. **Android (Chrome):** open the live address. After you have looked around (it may take a second visit), a card offers **Install Deploybase**. You can also open the Chrome menu and tap **Install app**. You should see a Deploybase icon on your home screen.
2. **iPhone (Safari):** open the live address, tap the **Share** button at the bottom, scroll down, tap **Add to Home Screen**, then **Add**. The site shows a short guide for this on your second visit. It only works in Safari.
3. **Offline test:** open the app and a project page while online. Turn on airplane mode and open the app again. The registry and the pages you opened still load, and a banner says you are offline. A page you never opened shows the branded offline page.
4. **Updates:** after a new deployment, open the app. A card says **Update available**. Tap **Refresh**. You are never forced onto old or new content in the middle of reading.

## Verification checklist

After a deployment, check these on the live address:

- The home page loads and shows eight deployments.
- The moon or sun button switches light and dark, and the choice is kept after a refresh.
- A project page opens, a file box opens, and **Copy text** shows "Copied to clipboard".
- A page that does not exist (add `/nothing` to the address) shows the branded 404 page.
- On a phone there is no sideways scrolling.
- The app installs and opens offline (above).

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Blank page or no styling | Files were moved so the addresses no longer match, or Pages serves the wrong folder | Check **Settings > Pages > Source** says **GitHub Actions**, then run **Deploy site** again |
| Old design still showing | Your browser or the installed app kept the previous version | Press **Ctrl + F5**, or open the app and tap **Refresh** on the update card |
| `404` when you refresh a project page | The address is missing its trailing `/` or the folder name is wrong | Use the address with the folder name and a trailing `/`, for example `.../classpulse-national/` |
| The `.github` folder is missing after copying files | Windows hides folders that start with a dot | In File Explorer click **View > Show > Hidden items** |
| Actions shows a red cross about links | A file name or link has a typo | Read the message (see above) |
| Pages is not enabled | **Source** is not set to GitHub Actions | Settings > Pages > Source > GitHub Actions |
| Install button never appears | The browser has not offered it yet, or the app is already installed | Visit twice, or use the browser menu: **Install app** (Chrome) or **Add to Home Screen** (Safari) |
| Offline page shows for a page you opened | That page was opened before the service worker was active | Open it once while online, then it is saved |
| The update card never appears | The browser checks for a new version when you return to the tab | Close the app, reopen it, wait a few seconds |
| Colours changed but look wrong | A colour in `data/themes.json` has low contrast | Read the yellow warning in the build and adjust the colour |

## Custom domain (optional, not set up)

The site is built for `https://babatundeawo.github.io/deploybase/`. To use your own domain:

1. **Settings > Pages > Custom domain**: type the domain and save.
2. At your domain provider add the DNS records GitHub shows you, then tick **Enforce HTTPS** once it appears.
3. In `data/projects.json` change `site.url` to the new address. If the new address has no folder name, the base path becomes `/` automatically.
4. In every page, replace `https://babatundeawo.github.io/deploybase/` with the new address (GitHub Desktop and most editors have **Find and replace in all files**). These are the canonical and social preview addresses.

## What GitHub Pages cannot do

- It cannot send real "301" redirects. Pages that moved use a soft redirect (a refresh tag, a canonical link, a visible link and a small script). Search engines treat these slightly more slowly than a true redirect.
- It cannot set security headers. The Content Security Policy is set with a `<meta>` tag, so a few headers cannot be set. See `SECURITY.md`.
- It sets its own caching times for files, so changes can take a few minutes to reach every visitor.
