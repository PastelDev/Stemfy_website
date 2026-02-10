# TODO

## Security Hardening

- [ ] Replace plaintext admin credentials with password hashing (`password_hash` / `password_verify`) and add a small credential-rotation guide.
- [ ] Add response security headers to admin pages (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- [ ] Tighten `admin/api.php` CORS policy for production (avoid `*` by default; use configurable allowed origins).
- [ ] Add optional per-user audit logging for admin create/update/delete actions.

## Frontend Safety and Robustness

- [ ] Remove remaining non-essential dynamic `innerHTML` writes in JS and move to DOM node creation where practical.
- [ ] Add URL allowlist validation for external links in competitions/news blocks.
- [ ] Add global error reporting hooks for failed content fetches (with user-visible fallback status, not console-only).

## Settings and i18n Consistency

- [ ] Fix settings modal behavior so it actually opens/closes, not only language toggle.
- [ ] Reintroduce a visible theme selector (`theme-select`) or remove dead theme-selector code paths.
- [ ] Add translation coverage checks to detect missing keys per page.

## Structure and Maintainability

- [ ] Split `js/double-pendulum.js` into smaller modules (physics, rendering, export, ui, mobile, chaos map).
- [ ] Split large CSS files (`css/main.css`, `css/simulations.css`) by feature and page.
- [ ] Reduce HTML duplication (nav/footer/settings modal) using includes or build-time partials.
- [ ] Remove deprecated/unused legacy references after local API flow is fully validated.

## Documentation and Metadata

- [ ] Update OG/Twitter metadata URLs from `pasteldev.github.io` to current production domain.
- [ ] Audit docs for stale environment details (contacts, deployment notes, and runtime paths).

## Quality Gates

- [ ] Add automated linting for PHP/JS/HTML/CSS.
- [ ] Add smoke tests for: login flow, CSRF rejection, upload validation, and API JSON output.
- [ ] Add pre-deploy checklist for data path, uploads permissions, and admin credentials.
