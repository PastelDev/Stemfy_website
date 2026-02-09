# STEMfy-website (STEMfy.gr)

![STEMfy.gr](https://img.shields.io/badge/STEMfy.gr-STEM%20for%20you-blue?style=for-the-badge)

Official website repository for **STEMfy.gr**: a galaxy-inspired, bilingual experience focused on interactive simulations, science news, challenges, and social content.

Live site: https://stemfy.gr

## Highlights

- Immersive shared layout: animated `starfield` canvas, logo nav, settings modal, and common footer across pages.
- Interactive double pendulum: RK4 integration, parameter controls, chaos map, downloads, and guided tutorial.
- Localized UI: English/Greek strings managed by `js/i18n.js`.
- Dynamic posts and news: frontend uses `js/cms-api.js`, now with **local API first** (`/admin/api.php`) and WordPress fallback (`cms.stemfy.gr`).
- Upload workflow: built-in PHP admin panel (`admin/`) is the primary way to publish posts/resources/news.

## Pages

- `index.html`: home hero and section cards.
- `simulations.html`: simulations overview.
- `double-pendulum.html`: flagship simulation page.
- `challenges.html`: active and planned challenges.
- `news.html`: announcements + competitions content.
- `posts.html`: post feed + educational resources.
- `about.html`, `contact.html`, `404.html`: standard info pages.

## Directory Snapshot

- `assets/`: images, logos, media assets.
- `icons/`: icon graphics and challenge previews.
- `css/`: shared and simulation-specific styles.
- `js/`: starfield, i18n, UI, CMS adapter, simulation logic.
- `admin/`: login, dashboard, CRUD forms, uploads, and JSON API.
- `descriptions/`: simulation concept notes and backlog references.

## Dynamic Content Flow

1. Frontend calls `js/cms-api.js`.
2. Adapter first tries local API: `/admin/api.php`.
3. If local API is unavailable, it falls back to WordPress REST endpoints on `cms.stemfy.gr`.
4. Data is normalized for `posts.html` and `news.html`.

`admin/api.php` supports:

- `type=posts`
- `type=news`
- `type=all`

## Admin Panel

Create `admin/credentials.php` (gitignored):

```php
<?php
define('ADMIN_USERNAME', 'your_username');
define('ADMIN_PASSWORD', 'your_password');
```

Main admin files:

- `admin/config.php`: session setup, paths, upload helpers, CSRF helpers, login-rate-limit helpers.
- `admin/login.php`: login form and authentication.
- `admin/posts.php`: manage media posts.
- `admin/resources.php`: manage PDF resources.
- `admin/news.php`: manage announcements.
- `admin/api.php`: public JSON endpoint for frontend.

Uploads are validated by extension, mime type, and max size (`UPLOAD_MAX_SIZE`, default 50 MB).

For a step-by-step publishing workflow (without WordPress), see [UPLOADING.md](UPLOADING.md).

## Running Locally

1. Static preview only:

```bash
python -m http.server 8000
```

or

```bash
npx serve
```

In static-only mode, `/admin/api.php` is unavailable, so frontend falls back to WordPress when reachable.

2. Full local admin/API mode (recommended):

```bash
php -S 0.0.0.0:8000
```

Run from repo root so `admin/` routes and local API work.

## Backup Scripts

- Linux/macOS: `scripts/backup-content.sh`
- Windows PowerShell: `scripts/backup-content.ps1`

Both scripts back up available content directories (`posts`, `admin/data`, `admin/uploads`) into timestamped archives.

## Tech Stack

- Markup/styling: plain HTML + CSS
- Frontend behavior: vanilla JavaScript
- Admin/backend: PHP
- Data storage: JSON + uploaded files
- Optional external fallback source: WordPress REST API

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Commit changes.
4. Push branch.
5. Open a pull request.

## Contact

- Instagram: [@stemfy.gr](https://instagram.com/stemfy.gr)
- Email: team@stemfy.gr

## License

MIT License. See [LICENSE](LICENSE).
