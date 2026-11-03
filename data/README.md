# Data

- `projects.json`: the registry. Each entry becomes a card and a ledger row on the home page. It also feeds the sitemap and the page's structured data. `site.url` sets the address and base path for the whole site. The `theme` value must match a theme in `themes.json`.
- `themes.json`: colours and fonts. The hub and every project have a `light` set of colours. Dark colours are worked out automatically from them, and the build warns if any text and background pair falls below the 4.5:1 contrast ratio. Add a `dark` block to a theme to set the dark colours by hand.
