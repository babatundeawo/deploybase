# Deployment guide

This guide is for the site owner. You do not need a terminal, and you do not need to install anything. Everything is done in your web browser on github.com.

## How deployment works, in plain words

GitHub stores your files. Each time you save a change to the **main** branch, a robot called **GitHub Actions** wakes up, builds the site, checks that no link is broken, and publishes it at https://babatundeawo.github.io/deploybase/. This takes about one to two minutes. You never press a "publish" button yourself.

## One-time setup: replacing the old repository

Do these steps in order. The old site stays safe, under a new name, until you are happy with the new one.

### Step 1: Rename the old repository (do not delete it yet)

1. Go to https://github.com/babatundeawo/deploybase
2. Click **Settings** (the tab on the right end of the row that starts with **Code**).
3. In the first box, **Repository name**, delete `deploybase` and type `deploybase-old`.
4. Click **Rename**.

You should see the page reload with the new name at the top. The old live site now sits at `babatundeawo.github.io/deploybase-old/`, and the address `babatundeawo.github.io/deploybase/` shows "404" until Step 5 is finished. This gap normally lasts a few minutes.

### Step 2: Create the new repository

1. Click the **+** at the top right of GitHub, then **New repository**.
2. **Repository name:** type exactly `deploybase` (all lowercase, no spaces).
3. Choose **Public**.
4. Leave every box under it unticked (no README, no .gitignore, no license).
5. Click **Create repository**.

You should see a page titled "Quick setup".

### Step 3: Upload the files

1. On your computer, unzip the file you downloaded from Claude. Open the unzipped folder so that you can see `index.html`, `assets`, `docs` and the project folders.
2. On the new repository page, click **uploading an existing file** (a blue link in the Quick setup box).
3. Select everything inside the folder (not the folder itself) and drag it into the browser window. Include the folder named `.github`. On a Mac, press `Command + Shift + .` in the Finder window to show hidden folders so you can select it.
4. Wait until every file shows a green tick (there are 80 files).
5. Scroll down. Leave **Commit directly to the main branch** selected, and click **Commit changes**.

You should see the list of files on the repository page, including `index.html`.

### Step 4: Check the workflow files arrived

1. Click the folder `.github`, then `workflows`.
2. You should see two files: `deploy.yml` and `codeql.yml`. Also check that `.github` contains `dependabot.yml`.

If `.github` is missing, your computer skipped the hidden folder. Create each file by hand instead:

1. On the repository's main page click **Add file**, then **Create new file**.
2. In the name box type `.github/workflows/deploy.yml` (typing each `/` creates a folder).
3. Open `docs/setup-files/deploy.yml.txt` in this repository, copy everything, and paste it into the big editor box.
4. Click **Commit changes**, then **Commit changes** again.
5. Repeat for `.github/workflows/codeql.yml` (copy from `docs/setup-files/codeql.yml.txt`) and `.github/dependabot.yml` (copy from `docs/setup-files/dependabot.yml.txt`).

### Step 5: Switch on GitHub Pages

1. Click **Settings**, then **Pages** in the left menu.
2. Under **Build and deployment**, find **Source** and choose **GitHub Actions**.
3. Click the **Actions** tab at the top, click **Deploy site** in the left list, click **Run workflow** (grey button on the right), then the green **Run workflow** button.

Wait two minutes and refresh. You should see a green tick next to the run, and https://babatundeawo.github.io/deploybase/ should show the new site.

### Step 6: Switch on the free security scanners

1. Click **Settings**, then **Code security** in the left menu (on some accounts it is called **Advanced security**).
2. Switch on **Dependabot alerts**.
3. Switch on **Secret scanning** (and **Push protection** if you see it).

### Step 7: Delete the old repository (only when you are happy)

Open `https://github.com/babatundeawo/deploybase-old`, click **Settings**, scroll to the bottom, click **Delete this repository** and follow the prompts. Deleting erases its history and cannot be undone, so wait until you have checked the new site on your phone and computer.

## Updating content day to day

1. Open the file on GitHub (for example `classpulse-national/index.html`).
2. Click the pencil icon (**Edit this file**) at the top right of the file.
3. Make your change.
4. Click **Commit changes**, then **Commit changes** again.

The site updates in one to two minutes.

### The safer way: preview before publishing

If you want a second pair of eyes or a check before anything goes live, choose **Create a new branch for this commit and start a pull request** instead, then click **Propose changes** and **Create pull request**. GitHub runs the same build and link checks on the pull request, and shows a green tick or red cross. The live site does not change until you click **Merge pull request**. To throw the change away, click **Close pull request**. GitHub Pages cannot show a visual preview of an unmerged change, so the checks are your safety net.

## How to check that a deployment worked

1. Click the **Actions** tab.
2. Look at the top row of the list.
   - A **green tick** means the site is live.
   - A **yellow circle** means it is still working. Wait a minute.
   - A **red cross** means something failed, and the live site stays on the last good version.

## How to read an error

1. Click the row with the red cross.
2. Click the red job name on the left (for example **Build and check**).
3. Click the step with the red cross. The message is written in plain words. Common ones:

| Message | What it means | Fix |
| --- | --- | --- |
| `points to a file that does not exist` | A link, image or file name is spelled wrongly or the file was not uploaded | Fix the spelling in the file named at the start of the message, or upload the missing file |
| `points to a section (#...) that does not exist` | A link to a part of a page uses a name that is not on that page | Check the `id` or the link name |
| `is missing "..."` or `is used twice` | An entry in `data/projects.json` is incomplete or repeated | Fix that entry |
| `Get Pages site failed` or `HttpError: Not Found` | GitHub Pages is not switched on | Do Step 5 above |

The Lighthouse report is a score card and never blocks a deployment. It appears in the run summary under **Artifacts**.

## How to go back to an earlier version

1. Click the **Actions** tab.
2. Scroll to the last run that has a green tick from before the change you want to undo, and click it.
3. Click **Re-run all jobs** (top right), then confirm.

This publishes that earlier version again. To fix the files themselves, open the file, click **History**, click the earlier version, and use the three dots menu to view it, then copy the old text back into the file with the pencil icon.

## Custom domain (optional, not set up)

The site is built for `https://babatundeawo.github.io/deploybase/`. To use your own domain, go to **Settings > Pages > Custom domain**, type the domain and save, then add the records GitHub shows you at your domain provider's DNS page. The web addresses written inside the pages (for example `canonical` and social preview addresses) would then also need to change to the new domain.
