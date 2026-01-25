# STEMfy-website (STEMfy.gr)

![STEMfy.gr](https://img.shields.io/badge/STEMfy.gr-STEM%20for%20you-blue?style=for-the-badge)

Official website repository for **STEMfy.gr** — a galaxy-inspired, bilingual experience that highlights interactive simulations, science news, community challenges, and the content the team publishes on Instagram.

Live site: https://stemfy.gr

## Highlights

- **Immersive shared layout**: every page reuses the animated `starfield` canvas, the logo-based navigation bar, the settings modal (language + theme), and a footer with the Instagram link so the whole site feels cohesive.
- **Interactive double pendulum**: the simulation bundle uses RK4 integration, adjustable masses/lengths/angles/velocities, damping, infinite trails, chaos-map exploration, download helpers (snapshots + short videos), and a spotlight tutorial (`js/tutorial.js`) that walks visitors through the controls.
- **Localized + themed UI**: `js/i18n.js` supplies English/Greek translations for the nav, hero, cards, and page-specific blocks, while `THEMES` toggles the purple/blue palettes via CSS variables stored in `localStorage`.
- **Dynamic posts & news**: `posts.html` toggles between Instagram-style posts and educational resources (with modal previews), while `news.html` mirrors a newsletter/comps layout and streams announcements from `admin/api.php`. Both pages re-render when the language setting changes.
- **Admin workflow**: the PHP-powered admin panel (`admin/`) lets the team log in, manage posts/resources/news, store uploads under `admin/uploads/`, and expose the same data to the public site via `admin/api.php?type={posts,news,all}`.

## Pages at a glance

- `index.html`: hero + company story, navigation cards that link to every major section, rotating logo, quick stats, and prompts for simulations, challenges, news, and posts. Includes the shared settings modal + language toggle.
- `simulations.html`: a gallery of simulations (Double Pendulum, Bridge Builder, Mandelbrot Set) where only the first is live and the others are flagged as “coming soon” (see `descriptions/coming-soon.md`).
- `double-pendulum.html`: the flagship simulation with chaos map panel, control panel, view toggles, download helpers, trail options, chaos-map explanations, challenges callouts, and the tutorial overlay described above. It loads `css/simulations.css`, `js/double-pendulum.js`, `js/tutorial.js`, `js/ui.js`, `js/starfield.js`, and `js/i18n.js`.
- `challenges.html`: cards for Pendulum Trajectory and Chaos Map Explorer (both active and link back to the simulation), plus placeholders for Mandelbrot Zoom and Bridge Master. Each card has badges, descriptions, and Instagram submission links.
- `news.html`: newsletter notes, competition grid (Math / Physics / Informatics / Science & Research / Astronomy with curated links), and an announcement feed populated from `admin/api.php?type=news` (pinned items appear first).
- `posts.html`: toggles between Posts (dynamic media cards + modal preview) and Educational Resources (PDF links). Fetches `admin/api.php?type=posts`, renders counts, and opens media in a modal. Language changes trigger re-renders.
- `about.html`, `contact.html`, `404.html`: now share the same navigation, settings modal, and footer, and they are fully localized through `js/i18n.js`.

## Directory snapshot

- `assets/`: shared logo, icons, and imagery referenced by every page.
- `css/main.css`: palette, typography, nav/footer layout, responsive helpers, and shared scaffolding.
- `css/simulations.css`: layout for the double-pendulum view (control/chaos panels, chaos warning modal, tutorial, toggles).
- `js/`: `starfield.js` (background), `i18n.js` (language/theme manager + DOM updates), `ui.js` (language toggle button), `double-pendulum.js` (physics + chaos map + downloads), `tutorial.js`, plus helpers.
- `admin/`: PHP admin dashboard (login, dashboard, posts/resources/news controllers, templates, CSS), `api.php` for the public JSON endpoint, `config.php` for credentials/data paths, and directories for `uploads/` and `data/` (JSON files with posts/resources/announcements).
- `descriptions/`: storyboards for the double pendulum, bridge builder, and Mandelbrot simulations plus a “coming soon” note that tracks planned challenges.

## Internationalization & theming

`js/i18n.js` hosts the English/Greek dictionaries, instantiates `I18nManager`, and:

1. Applies the stored language (`stemfy-language`) and theme (`stemfy-theme`) on load.
2. Updates every page block (nav, hero, cards, page-specific sections, modals) via `updatePageContent()`.
3. Exposes `setLanguage()` and `setTheme()` that persist choices in `localStorage` and emit `languageChanged` events.

The settings modal exposes both selectors. `js/ui.js` wires the floating gear button to toggle languages, and the modal’s theme selector updates the CSS custom properties defined in `THEMES` (purple and blue palettes).

## Dynamic content & admin API

- `admin/api.php` exposes `type=posts`, `type=news`, or `type=all`. The endpoint caches responses for about five minutes via `Cache-Control: public, max-age=300` and sorts pinned announcements first.
- `admin/data/posts.json` stores bilingual posts plus educational resources; each post includes `media[]` (image/video), localized text, and timestamps. `admin/data/news.json` keeps announcements with categories, pinned flags, and optional PDF links.
- `admin/uploads/{posts,resources,news}/` hold the binaries submitted via the admin forms. Files are validated for mime type and size (50 MB limit) before being normalized and moved into `UPLOAD_DIR`.

The public pages consume this API:

- `posts.html` (posts + resources) renders cards with preview counts and opens media in a modal.
- `news.html` loads announcements, translates their category/date strings, and honors the pinned order.

If the API call fails, both pages fall back to localized placeholders.

## Admin panel

Log in via `admin/login.php` after creating `admin/credentials.php`:

```php
<?php
define('ADMIN_USERNAME', 'your_username');
define('ADMIN_PASSWORD', 'your_password');
```

`admin/config.php` boots the session, defines paths, ensures data/upload directories exist, and provides helpers (`generateId`, `sanitizeInput`, file uploads, deletion). The dashboard (`admin/index.php`) displays counts and quick-action buttons.

- `admin/posts.php`: create/edit/delete posts, require at least one media item, and normalize uploads before writing to `posts.json`.
- `admin/resources.php`: manage PDF resources (type plus bilingual text) stored in `posts.json`’s `resources` array.
- `admin/news.php`: manage announcements with categories, pinning, optional PDF attachments, and deletion (pins appear first via the API).

All admin views reuse `templates/header.php` and `admin.css`.

## Running locally

1. **PHP server (recommended)** – run `php -S 0.0.0.0:8000` from the repo root. PHP’s built-in server serves both the static pages and the `admin/api.php`/admin routes.
2. **Static-only preview** – `python -m http.server 8000` or `npx serve` works for HTML/CSS/JS, but the admin API will 404 because PHP is missing, so posts/news fall back to placeholders.

Keep `admin/credentials.php` in place and ensure `admin/data/` stays writable so JSON files can be updated.

## Local admin setup checklist

1. Copy `admin/credentials.php` (gitignored) with `ADMIN_USERNAME`/`ADMIN_PASSWORD`.
2. Confirm PHP CLI (8+) is installed and run `php -S` from the root so `admin/` routes function.
3. Upload new media via the admin forms; `config.php` limits uploads to 50 MB and only allows common image/video/PDF extensions.
4. When removing posts/resources/news, the JSON file is rewritten and the prior upload file is deleted.

## Future & reference docs

- `descriptions/double-pendulum.md`, `descriptions/bridge-builder.md`, and `descriptions/mandelbrot.md` document the ideas, goals, and UX notes for each simulation.
- `descriptions/coming-soon.md` catalogs Bridge Builder + Mandelbrot Set simulations along with the Bridge Master and Mandelbrot Zoom challenges that are still in the backlog.

## Tech stack

- **Markup & styling**: plain HTML + CSS (Outfit-inspired typography + galaxy gradients)
- **Interactions**: Vanilla JavaScript (`js/i18n.js`, `js/double-pendulum.js`, `js/tutorial.js`, `js/ui.js`, `js/starfield.js`)
- **Server/API**: PHP for the admin panel plus `admin/api.php`
- **Data**: JSON files under `admin/data/`

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Describe your change"`.
4. Push the branch: `git push origin feature/your-feature`.
5. Open a pull request describing the updates.

## Contact

- **Instagram**: [@stemfy.gr](https://instagram.com/stemfy.gr)
- **Email**: stelirapt7@gmail.com

## License

This project is open source under the [MIT License](LICENSE).
