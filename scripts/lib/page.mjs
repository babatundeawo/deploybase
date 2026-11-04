// Shared pieces of the page <head>, so every page gets exactly the same rules.

// GitHub Pages cannot send security headers, so the policy is set with a <meta> tag.
// Scripts, styles, fonts and images all come from this site only.
export const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; " +
  "connect-src 'self'; manifest-src 'self'; worker-src 'self'; base-uri 'self'; form-action 'none'; object-src 'none'";

export function themeColorMetas(palette) {
  const one = (scheme) =>
    `<meta name="theme-color" content="${palette[scheme].bg}" media="(prefers-color-scheme: ${scheme})" data-scheme="${scheme}" data-media="(prefers-color-scheme: ${scheme})">`;
  return `${one("light")}\n${one("dark")}`;
}

// Rewrites the theme-color lines of a page so they always match data/themes.json.
export function syncThemeColor(html, palette) {
  const block = themeColorMetas(palette);
  const re = /<meta name="theme-color"[^>]*>\s*(?:<meta name="theme-color"[^>]*>\s*)?/;
  if (!re.test(html)) return html;
  return html.replace(re, block + "\n");
}

export const slugOf = (html) => (html.match(/<html[^>]*data-theme="([^"]+)"/) || [])[1];
