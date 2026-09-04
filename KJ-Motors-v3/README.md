# KJ Motors

Static website for KJ Motors, an independent showroom of imported Japanese and German vehicles.

## What's included
- 22 HTML pages (home, inventory + 4 category pages, brands, services, finance calculator,
  compare tool, gallery, blog, FAQ, testimonials, contact, team, offers, wishlist, login,
  register, book-test-drive, about).
- `js/car-data.js` — 109 sample vehicles (Japanese + German marques) with price, mileage,
  fuel, transmission, condition and origin. This is placeholder/randomly generated data —
  swap in your real inventory by editing this file (or wiring it up to a backend/CMS).
- Fully working, framework-free JS: hero slider, inventory filtering + pagination, compare
  tool, lightbox gallery, form validation, and a finance calculator — all in `js/`.
- `css/style.css`, `css/responsive.css`, `css/animations.css`, plus per-page overrides in
  `css/pages/`.

## Images
Photos throughout use https://picsum.photos placeholder images (seeded, so they stay
consistent per car/section) — they require an internet connection to load. Drop real photos
into the matching `images/` subfolder and update the `image`/`src` paths to switch over.

## Running it
No build step — open `index.html` directly in a browser, or serve the folder with any
static file server (e.g. `npx serve .`).
