# STEMfy-website (STEMfy.gr)

![STEMfy.gr](https://img.shields.io/badge/STEMfy.gr-STEM%20for%20you-blue?style=for-the-badge)

Official website repository for **STEMfy.gr** — a galaxy-inspired, bilingual experience that highlights interactive simulations, science news, community challenges, and the content the team publishes on Instagram.

Live site: https://stemfy.gr

## Highlights

- **Immersive shared layout**: every page reuses the animated `starfield` canvas, the logo-based navigation bar, the settings modal (language + theme), and a footer with the Instagram link so the whole site feels cohesive.
- **Interactive double pendulum**: the simulation bundle uses RK4 integration, adjustable masses/lengths/angles/velocities, damping, infinite trails, chaos-map exploration, download helpers (snapshots + short videos), and a spotlight tutorial (`js/tutorial.js`) that walks visitors through the controls.
- **Localized + themed UI**: `js/i18n.js` supplies English/Greek translations for the nav, hero, cards, and page-specific blocks, while `THEMES` toggles the purple/blue palettes via CSS variables stored in `localStorage`.
- **Dynamic posts & news**: `posts.html` toggles between Instagram-style posts and educational resources (with modal previews), while `news.html` displays announcements. Content is loaded from local JSON files via the admin panel.
- **Simple content management**: the PHP admin panel (`admin/`) allows managing posts, resources, and news through a web interface. All data is stored in JSON files.

## Pages at a glance

- `index.html`: hero + company story, navigation cards that link to every major section, rotating logo, quick stats, and prompts for simulations, challenges, news, and posts. Includes the shared settings modal + language toggle.
- `simulations.html`: a gallery of simulations (Double Pendulum, Bridge Builder, Mandelbrot Set) where only the first is live and the others are flagged as "coming soon" (see `descriptions/coming-soon.md`).
- `double-pendulum.html`: the flagship simulation with chaos map panel, control panel, view toggles, download helpers, trail options, chaos-map explanations, challenges callouts, and the tutorial overlay described above. It loads `css/simulations.css`, `js/double-pendulum.js`, `js/tutorial.js`, `js/ui.js`, `js/starfield.js`, and `js/i18n.js`.
- `challenges.html`: cards for Pendulum Trajectory and Chaos Map Explorer (both active and link back to the simulation), plus placeholders for Mandelbrot Zoom and Bridge Master. Each card has badges, descriptions, and Instagram submission links.
- `news.html`: newsletter notes, competition grid (Math / Physics / Informatics / Science & Research / Astronomy with curated links), and an announcement feed from the local JSON API. Pinned items appear first.
- `posts.html`: toggles between Posts (dynamic media cards + modal preview) and Educational Resources (PDF links). Fetches from local JSON API, renders counts, and opens media in a modal. Language changes trigger re-renders.
- `about.html`, `contact.html`, `404.html`: share the same navigation, settings modal, and footer, and they are fully localized through `js/i18n.js`.

## Directory snapshot

```
/
├── posts/                          # Content data folder (see Deployment section)
│   ├── credentials.php             # Admin login credentials
│   ├── posts.json                  # Posts and resources data
│   ├── news.json                   # News/announcements data
│   └── README-DELETE-BEFORE-DEPLOY.txt
│
├── admin/                          # PHP admin panel
│   ├── config.php                  # Configuration & helpers
│   ├── api.php                     # Public JSON API endpoint
│   ├── download-backup.php         # Backup download endpoint
│   ├── login.php                   # Admin login
│   ├── index.php                   # Dashboard
│   ├── posts.php                   # Posts management
│   ├── resources.php               # Resources management
│   ├── news.php                    # News management
│   ├── uploads/                    # Uploaded media files
│   └── templates/                  # Shared admin templates
│
├── js/
│   ├── starfield.js                # Background animation
│   ├── i18n.js                     # Internationalization
│   ├── ui.js                       # UI interactions
│   ├── local-api.js                # Local JSON API client
│   ├── double-pendulum.js          # Physics simulation
│   └── tutorial.js                 # Interactive tutorial
│
├── css/
│   ├── main.css                    # Global styles
│   └── simulations.css             # Simulation-specific styles
│
├── assets/                         # Images & icons
├── descriptions/                   # Simulation documentation
└── *.html                          # Public pages
```

## Content Management

### Data Storage

All content is stored in the `posts/` folder:

- **`posts.json`**: Posts and educational resources with bilingual support (English/Greek)
- **`news.json`**: Announcements with categories, pinned flags, and optional PDF links
- **`credentials.php`**: Admin panel login credentials

### Admin Panel

Access the admin panel at `/admin/` to manage content:

1. **Posts**: Create Instagram-style posts with images/videos
2. **Resources**: Add educational PDFs and guides
3. **News**: Publish announcements with categories (general, competition, event, update)

### Public API

The public API endpoint (`/admin/api.php`) serves content to the frontend:

- `?type=posts` - Returns posts and resources
- `?type=news` - Returns announcements (sorted: pinned first, then by date)
- `?type=all` - Returns everything

## Deployment to Plesk

### Important: The `posts/` folder workflow

The `posts/` folder is included in this repository as a **template** to help you understand the structure. However, for production deployment:

1. **Before pushing to GitHub** (for public repositories):
   - Delete the `posts/` folder from the repository
   - This prevents credentials and data from being exposed publicly

2. **After deploying to Plesk hosting**:
   - Manually upload the `posts/` folder to the root of your website
   - Update `posts/credentials.php` with secure admin credentials
   - Set folder permissions: `755` for directories, `644` for files

### Backup Your Data

Once running on Plesk, you can download a backup of all your content:

1. Log in to the admin panel at `https://stemfy.gr/admin/`
2. Navigate to `https://stemfy.gr/admin/download-backup.php`
3. A ZIP file containing all posts data and uploaded media will be downloaded

Use this backup feature regularly to:
- Save your content before making repository changes
- Keep local copies of uploaded media
- Migrate content between servers

### Deployment Steps

1. **Clone the repository** to your Plesk hosting
2. **Delete `posts/` from the repo** if it exists (for security)
3. **Upload `posts/` manually** via Plesk File Manager:
   ```
   /posts/
     ├── credentials.php  (with your secure credentials)
     ├── posts.json       (from your backup or empty template)
     └── news.json        (from your backup or empty template)
   ```
4. **Set permissions** so PHP can write to the folder
5. **Test** the admin panel and public pages

## Running locally

1. **PHP server** – run `php -S 0.0.0.0:8000` from the repo root to test the full site including the admin panel.

2. **Static preview** – `python -m http.server 8000` or `npx serve` works for HTML/CSS/JS only. Posts/news will show as empty since the PHP API won't run.

### Local setup checklist

1. Ensure the `posts/` folder exists with:
   - `credentials.php` with `ADMIN_USERNAME` and `ADMIN_PASSWORD`
   - `posts.json` (can start with `{"posts": [], "resources": []}`)
   - `news.json` (can start with `{"announcements": []}`)
2. Confirm PHP CLI (8+) is installed
3. Run `php -S 0.0.0.0:8000` from the project root
4. Access the admin panel at `http://localhost:8000/admin/`

## Internationalization & theming

`js/i18n.js` hosts the English/Greek dictionaries, instantiates `I18nManager`, and:

1. Applies the stored language (`stemfy-language`) and theme (`stemfy-theme`) on load.
2. Updates every page block (nav, hero, cards, page-specific sections, modals) via `updatePageContent()`.
3. Exposes `setLanguage()` and `setTheme()` that persist choices in `localStorage` and emit `languageChanged` events.

The settings modal exposes both selectors. `js/ui.js` wires the floating gear button to toggle languages, and the modal's theme selector updates the CSS custom properties defined in `THEMES` (purple and blue palettes).

## Future & reference docs

- `descriptions/double-pendulum.md`, `descriptions/bridge-builder.md`, and `descriptions/mandelbrot.md` document the ideas, goals, and UX notes for each simulation.
- `descriptions/coming-soon.md` catalogs Bridge Builder + Mandelbrot Set simulations along with the Bridge Master and Mandelbrot Zoom challenges that are still in the backlog.

## Tech stack

- **Markup & styling**: plain HTML + CSS (Outfit-inspired typography + galaxy gradients)
- **Interactions**: Vanilla JavaScript (`js/i18n.js`, `js/double-pendulum.js`, `js/tutorial.js`, `js/ui.js`, `js/starfield.js`, `js/local-api.js`)
- **Server/API**: PHP admin panel with JSON file storage
- **Data**: JSON files in `posts/` folder, uploaded media in `admin/uploads/`

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
