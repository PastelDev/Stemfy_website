# STEMfy.gr — Website & Brand Audit + Improvement Proposal

**Date:** 2026-03-18
**Scope:** Visual identity, technical architecture, content strategy, and roadmap

---

## PART 1: CURRENT STATE — QUALITATIVE OVERVIEW

### 1.1 What STEMfy.gr Is Today

STEMfy.gr is a bilingual (English/Greek) educational website created by three students with a mission to **"Make STEM Addictive!"**. The site combines interactive physics simulations, scientific news, challenges, and Instagram-style posts into a dark-themed, space-inspired web experience.

The site currently feels like a **polished prototype** — it has strong foundations (a working physics simulation, a starfield background, bilingual support, an admin CMS) but limited content depth and community features. It reads as a passion project with professional ambitions.

### 1.2 Visual Identity Summary

**Mood:** Dark, cosmic, educational, slightly playful. The starfield background and purple-magenta palette create a "space exploration" atmosphere that frames STEM learning as a journey through the unknown.

**Strengths:**
- Consistent purple-centric color palette across all elements
- The animated starfield is a strong signature visual element
- The double-pendulum simulation is genuinely impressive and well-executed
- Bilingual support shows maturity and inclusivity
- The "three curious students" branding is authentic and relatable

**Weaknesses:**
- Only one simulation exists (double pendulum) — the "simulations" promise feels thin
- The icon assets are inconsistent in style (some pixel-art, some 3D-rendered, some flat)
- The "Press Start 2P" pixel font is declared but barely used — the pixel identity is half-committed
- No clear typographic hierarchy beyond Outfit (one font does everything)
- The logo is a PNG (not SVG) — limits scalability and crispness
- Large PNG icons (2+ MB each) hurt load times without adding visual value

### 1.3 Content & Community State

| Area | Status |
|------|--------|
| Simulations | 1 live (double pendulum), 2 "coming soon" |
| Posts | 1 published (intro post from Jan 2026) |
| News | 0 published |
| Resources | 0 published |
| Challenges | 2 defined, 0 with submissions |
| Newsletter | "Coming soon" placeholder |
| User accounts | None |
| Community features | None (Instagram is the only social channel) |
| Instagram | @stemfy.gr — single platform presence |

The site is **content-starved**. The architecture exists for posts, news, and resources, but almost nothing has been published. This makes the site feel abandoned despite the strong technical foundation.

---

## PART 2: CURRENT STATE — TECHNICAL OVERVIEW

### 2.1 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML5 + CSS3 + JavaScript (no framework) |
| Graphics | Canvas 2D API (starfield, simulations) |
| Backend | PHP 7+ (admin panel only) |
| Storage | JSON files (posts.json, news.json, resources.json) |
| CMS Fallback | WordPress REST API (cms.stemfy.gr) |
| Hosting | Plesk server (stemfy.gr) + GitHub Pages (static fallback) |
| Fonts | Google Fonts (Outfit) |
| Build System | None — raw files served directly |
| Package Manager | None — no npm, no dependencies |

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   BROWSER                        │
│                                                  │
│  index.html ─┐                                   │
│  simulations ─┤  ← Static HTML pages             │
│  posts.html  ─┤     (no SPA routing)             │
│  news.html   ─┤                                  │
│  challenges  ─┤                                  │
│  about.html  ─┤                                  │
│  contact.html─┘                                  │
│       │                                          │
│  css/main.css ── css/simulations.css              │
│       │                                          │
│  js/starfield.js ── js/i18n.js ── js/common.js   │
│  js/double-pendulum.js ── js/tutorial.js         │
│  js/cms-api.js                                   │
│       │                                          │
│       ▼                                          │
│  cms-api.js tries:                               │
│    1. /admin/api.php (local) ──► JSON files       │
│    2. cms.stemfy.gr (WordPress) ──► WP REST API   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              ADMIN PANEL (/admin/)               │
│                                                  │
│  login.php ── config.php ── credentials.php      │
│       │                                          │
│  posts.php ──► admin/data/posts.json             │
│  news.php  ──► admin/data/news.json              │
│  resources.php ──► admin/data/resources.json     │
│       │                                          │
│  sync.php ──► GitHub API (PR creation)           │
│       │                                          │
│  uploads/posts/ ── uploads/news/ ──              │
│  uploads/resources/                              │
└─────────────────────────────────────────────────┘
```

### 2.3 File Structure Summary

```
Stemfy_website/
├── 9 HTML pages (index, simulations, double-pendulum, posts,
│                 news, challenges, about, contact, 404)
├── css/          2 stylesheets (main.css, simulations.css)
├── js/           7 scripts (starfield, i18n, double-pendulum,
│                            tutorial, cms-api, common, ui)
├── admin/        PHP CMS (login, posts, news, resources, sync, api)
│   ├── data/     JSON storage files
│   ├── uploads/  Media files
│   └── templates/ Header/footer includes
├── assets/       Logo, profile image, videos
├── icons/        PNG icon illustrations (~25 MB total)
└── descriptions/ Simulation concept notes
```

### 2.4 Key Technical Characteristics

**No build pipeline.** Files are served raw — no bundling, no minification, no tree-shaking. This keeps the development loop simple but limits optimization.

**No component reuse.** Navigation, footer, settings modal, and starfield canvas are copy-pasted across all 9 HTML pages. Changes to shared elements require editing every file.

**JSON-file CMS.** The admin panel reads/writes JSON files directly — no database. This is simple and portable but doesn't scale for concurrent users, search, or relational data.

**Double-pendulum simulation is the crown jewel.** At 2,948 lines, it includes RK4 physics integration, chaos map generation, trail rendering, mobile optimization, and a tutorial system. It's production-quality work.

**Internationalization is thorough.** The i18n.js file (947 lines) provides full English/Greek translations for every UI string, with runtime language switching and localStorage persistence.

### 2.5 Visual Identity — Technical Assets

#### Logo
- **File:** `assets/logo.png` — 720x720px PNG, 382 KB
- **Usage:** Favicon + nav header (44x44px with purple glow border)
- **Animation:** 60-second infinite rotation
- **Issue:** PNG format limits scalability; no SVG version exists

#### Typography
- **Primary:** Outfit (Google Fonts) — weights 300–800
- **Legacy:** Press Start 2P (pixel font) — declared in CSS but unused in practice
- **CSS Variables:** `--font-display` and `--font-body` both map to Outfit

#### Color Palette

| Token | Hex | Role |
|-------|-----|------|
| `--bg-deep` | `#0a0812` | Page background (near-black purple) |
| `--bg-surface` | `rgba(18,12,28,0.85)` | Card/panel backgrounds |
| `--purple-dim` | `#2a1a4a` | Subtle accents, borders |
| `--purple-mid` | `#6a4a9e` | Secondary elements |
| `--purple-bright` | `#b08af0` | Primary brand purple |
| `--purple-glow` | `#d4a0ff` | Highlights, glow effects |
| `--accent` | `#ff7aec` | Magenta accent (CTAs, chaos) |
| `--accent-cyan` | `#6bfff0` | Cyan accent (secondary) |
| `--white` | `#f8f4ff` | Primary text (warm off-white) |
| `--gray` | `#9a8aaa` | Secondary text |

#### Starfield Background
- **Implementation:** Canvas 2D, 400 stars, drift animation
- **Star colors:** 21-step gradient from dark purple (`#1a1a3a`) to bright white (`#e8f0ff`)
- **Motion:** Diagonal drift at variable speeds based on star size (parallax effect)
- **Background:** `#080a14` (deep navy)

#### Icons
- **Navigation cards:** PNG illustrations (rocket, news, trophy, heart) — 600–775 KB each
- **Subject icons:** High-res PNGs (gear, pi, flask, atom, ai-brain, chip, owl) — 2+ MB each
- **UI icons:** Inline SVGs (globe, play/pause, download, settings)
- **Style inconsistency:** Mix of 3D-rendered, flat, and emoji-like styles

#### Simulation Colors
```
Pivot:    #b08af0 (purple)
Rod:      #6a4a9e (medium purple)
Mass 1:   #d4a0ff (light purple)
Mass 2:   #ff7aec (magenta)
Trail:    #ff7aec → #b08af0 (magenta to purple fade)
Stable:   #1a3a5a (dark blue — chaos map)
Chaotic:  #ff7aec (magenta — chaos map)
```

---

## PART 3: TECHNICAL RESTRUCTURING PROPOSAL

### 3.1 Current Problems

1. **HTML duplication** — Nav, footer, settings, starfield duplicated across 9 files
2. **No build system** — No minification, bundling, or asset optimization
3. **Monolithic simulation JS** — `double-pendulum.js` is 2,948 lines in one file
4. **No component architecture** — Adding a new page means copy-pasting 100+ lines of boilerplate
5. **JSON-file storage** — No search, no relations, no concurrent write safety
6. **25+ MB of unoptimized PNGs** — Subject icons are 2 MB each
7. **No testing** — No unit tests, no integration tests, no CI/CD
8. **No user system** — Can't support community features, leaderboards, or submissions

### 3.2 Proposed Technical Architecture

#### Phase 1: Static Site Generator (Short-term)

Migrate from raw HTML to a lightweight static site generator like **Astro** or **11ty (Eleventy)**. This solves HTML duplication while keeping the vanilla JS philosophy.

```
stemfy.gr/
├── src/
│   ├── layouts/
│   │   └── Base.astro          # Shared nav, footer, starfield, i18n
│   ├── pages/
│   │   ├── index.astro
│   │   ├── simulations/
│   │   │   ├── index.astro     # Catalog
│   │   │   └── [slug].astro    # Individual simulations
│   │   ├── learn/
│   │   │   ├── index.astro     # Articles hub
│   │   │   └── [slug].astro    # Individual articles
│   │   ├── competitions/
│   │   │   ├── index.astro     # Competition listing
│   │   │   └── [slug].astro    # Individual competitions with leaderboards
│   │   ├── community/
│   │   │   ├── index.astro     # Community hub
│   │   │   └── submit.astro    # User submission form
│   │   ├── posts.astro
│   │   ├── about.astro
│   │   └── contact.astro
│   ├── components/
│   │   ├── Starfield.astro
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── SimulationCanvas.astro
│   │   ├── LeaderboardTable.astro
│   │   ├── ArticleCard.astro
│   │   └── CompetitionCard.astro
│   ├── simulations/
│   │   ├── double-pendulum/
│   │   │   ├── physics.js      # RK4 engine
│   │   │   ├── renderer.js     # Canvas rendering
│   │   │   ├── controls.js     # UI controls
│   │   │   ├── chaos-map.js    # Chaos visualization
│   │   │   └── tutorial.js     # Guided walkthrough
│   │   ├── bridge-builder/
│   │   └── mandelbrot/
│   ├── styles/
│   │   ├── global.css          # Variables, resets, typography
│   │   ├── components.css      # Shared component styles
│   │   └── simulations.css     # Simulation-specific styles
│   └── i18n/
│       ├── en.json
│       └── el.json
├── public/
│   ├── assets/
│   ├── icons/                  # Optimized SVGs (replacing PNGs)
│   └── fonts/                  # Self-hosted for performance
├── astro.config.mjs
└── package.json
```

**Benefits:**
- Shared layouts eliminate HTML duplication
- Built-in asset optimization (image compression, CSS/JS bundling)
- File-based routing with dynamic pages
- Markdown content support for articles
- Static output — still deployable anywhere, no runtime server needed

#### Phase 2: Backend for Community Features (Medium-term)

Replace the PHP admin panel with a proper backend to support user accounts, submissions, and leaderboards.

**Option A: Headless CMS + Serverless Functions**
- Content: Strapi, Directus, or Sanity (headless CMS)
- Auth: Supabase Auth or Auth0
- Database: Supabase (Postgres) or PlanetScale (MySQL)
- Functions: Vercel/Netlify serverless for leaderboard logic

**Option B: Full-stack Framework**
- Framework: Next.js or Astro + API routes
- Database: Supabase (Postgres)
- Auth: Supabase Auth
- File storage: Supabase Storage or Cloudflare R2

**Recommended: Option A** — keeps the static-first philosophy, adds backend only where needed.

#### Phase 3: Community & Automation (Long-term)

```
┌──────────────────────────────────────────────────────────┐
│                    stemfy.gr                               │
│                                                           │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌─────────┐ │
│  │ Simula- │  │ Articles │  │ Competi-   │  │Community│ │
│  │ tions   │  │ & Learn  │  │ tions &    │  │ Hub     │ │
│  │         │  │          │  │ Leaderboard│  │         │ │
│  └────┬────┘  └────┬─────┘  └─────┬──────┘  └────┬────┘ │
│       │            │              │               │      │
│       └────────────┴──────┬───────┴───────────────┘      │
│                           │                               │
│                    ┌──────┴──────┐                        │
│                    │  Supabase   │                        │
│                    │  (DB/Auth/  │                        │
│                    │   Storage)  │                        │
│                    └──────┬──────┘                        │
│                           │                               │
│              ┌────────────┼────────────┐                 │
│              │            │            │                  │
│        ┌─────┴────┐ ┌────┴─────┐ ┌────┴─────┐          │
│        │ User     │ │ Leader-  │ │ Content  │           │
│        │ Accounts │ │ boards   │ │ Submis-  │           │
│        │ & Roles  │ │ & Scores │ │ sions    │           │
│        └──────────┘ └──────────┘ └──────────┘           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              INSTAGRAM AUTOMATION PIPELINE                │
│                                                           │
│  New Simulation/Article/Competition Published              │
│       │                                                   │
│       ▼                                                   │
│  AI Agent (Claude API) generates:                         │
│    - Instagram carousel post (3-5 slides)                 │
│    - Caption with hashtags                                │
│    - Story assets                                         │
│       │                                                   │
│       ▼                                                   │
│  Review queue (admin approval)                            │
│       │                                                   │
│       ▼                                                   │
│  Instagram Graph API → scheduled post                     │
└──────────────────────────────────────────────────────────┘
```

### 3.3 Proposed Page/Feature Map

| Section | Current | Proposed |
|---------|---------|----------|
| **Home** | 4 card links | Dynamic hero with featured content, latest activity feed |
| **Simulations** | 1 live, 2 placeholders | Simulation catalog with tags, difficulty levels, user favorites |
| **Learn** | (doesn't exist) | Articles hub: tutorials, explainers, concept breakdowns |
| **Competitions** | 2 static challenges | Active competitions with deadlines, leaderboards, submission system |
| **Community** | (doesn't exist) | User profiles, submitted simulations/articles, partnerships section |
| **Posts** | Instagram mirror | Rich blog with embedded simulations, cross-posted to Instagram |
| **News** | Empty | Event calendar, conference listings, scholarship alerts |
| **About** | Static text | Team profiles, partner logos, mission/values |

### 3.4 Key New Features to Build

1. **User Authentication** — Sign up/login (Supabase Auth), profiles, saved progress
2. **Simulation Submission System** — Users upload their own simulations (iframe sandbox or approved code)
3. **Leaderboard Engine** — Per-competition scoring, global rankings, badges
4. **Article/Resource CMS** — Markdown editor, LaTeX support, embedded simulations
5. **Competition Manager** — Create competitions with rules, deadlines, submission types, judging
6. **Partnership Portal** — Organizations can propose/manage joint competitions or content
7. **Instagram Automation** — AI-generated post drafts from new content, scheduled publishing
8. **Notification System** — Email/push notifications for new competitions, results, content
9. **Search** — Full-text search across simulations, articles, competitions, community content
10. **Analytics Dashboard** — Track engagement, popular simulations, competition participation

---

## PART 4: VISUAL IDENTITY & UI/UX IMPROVEMENT PROPOSAL

### 4.1 Current Visual Identity Assessment

The current identity is **dark-cosmic-purple** — a space-themed aesthetic with glowing purple accents. It works well for a physics simulation site but needs refinement to feel **mature, bold, and community-oriented** rather than just "cool student project."

### 4.2 Areas for Visual Identity Change

#### AREA 1: Logo & Brand Mark

**Current:** 720x720 PNG, used at 44x44px with purple glow. Rotates slowly. No SVG version.

**Proposed changes:**
- **Convert to SVG** for crisp rendering at any size
- **Create a simplified icon version** (for favicon, mobile app icon, social avatars)
- **Create a wordmark version** ("STEMfy" in a custom-weight Outfit or a distinctive display font)
- **Define clear usage rules** — minimum size, spacing, color variants (light bg, dark bg, monochrome)
- **Remove the rotation animation** — it's playful but undermines professionalism
- **Examples:** A geometric atom/star hybrid mark in `#b08af0` that works at 16px and 160px. A clean wordmark where the "fy" has a subtle gradient accent.

#### AREA 2: Typography System

**Current:** Outfit for everything, Press Start 2P declared but unused.

**Proposed changes:**
- **Commit to the pixel aesthetic or drop it.** If you want "a bit pixelated," use a pixel font deliberately for specific elements (section headers, badges, competition names) — not as a forgotten CSS variable
- **Add a monospace accent font** for code snippets, simulation data readouts, and technical content (e.g., JetBrains Mono, IBM Plex Mono, or Space Mono which is already imported but unused)
- **Define a type scale** with clear hierarchy:
  - Display: Pixel font or bold Outfit (hero headlines)
  - Heading: Outfit 700 (section titles)
  - Body: Outfit 400 (content text)
  - Code/Data: Monospace (simulation readouts, code)
  - UI: Outfit 500 (buttons, labels, navigation)
- **Examples:** Competition names in Press Start 2P at 14px. Leaderboard scores in Space Mono. Article body in Outfit 400 at 1.1rem with generous line-height.

#### AREA 3: Color Palette Refinement

**Current:** Purple-dominated with magenta and cyan accents. Works but could be more structured.

**Proposed changes:**
- **Define semantic color roles** instead of just aesthetic names:
  - Primary: `#b08af0` (brand purple — buttons, links, active states)
  - Secondary: `#ff7aec` (magenta — notifications, alerts, "hot" items)
  - Tertiary: `#6bfff0` (cyan — success states, new content, "cool" items)
  - Danger: A warm red (currently missing — needed for error states)
  - Warning: A warm amber (currently missing — needed for deadlines)
- **Add subject-specific accent colors** for content categorization:
  - Physics: `#b08af0` (purple)
  - Mathematics: `#6bfff0` (cyan)
  - Technology/AI: `#ff7aec` (magenta)
  - Engineering: `#ffb347` (amber — new)
  - Science: `#7aff8a` (green — new)
- **Increase contrast ratios** for accessibility (some gray-on-dark combinations fail WCAG AA)
- **Examples:** Article tags color-coded by subject. Competition difficulty badges in graduated colors (green → amber → magenta).

#### AREA 4: Icon System

**Current:** Mix of 3D-rendered PNGs (2+ MB), flat PNGs, and inline SVGs. Inconsistent styles.

**Proposed changes:**
- **Adopt a single icon style** — either:
  - **Option A: Pixel-art icons** (aligns with "a bit pixelated" goal) — 32x32 or 64x64 grid-aligned pixel illustrations
  - **Option B: Line icons with glow** — thin SVG outlines with purple glow effect, matching the starfield aesthetic
  - **Option C: Geometric/minimal** — simple geometric shapes, bold, single-color with subtle gradients
- **Convert all icons to SVG** — eliminates the 25 MB of PNGs, enables theming and animation
- **Create an icon for each content type**: simulation, article, competition, community post, resource, user
- **Examples:** A pixel-art rocket (24x24 grid) for simulations. A geometric trophy outline with magenta glow for competitions. A circuit-board pattern icon for technology articles.

#### AREA 5: Starfield & Background System

**Current:** Canvas-based starfield on every page. Beautiful but uniform.

**Proposed changes:**
- **Keep the starfield as the signature element** but add variation:
  - Home page: Full starfield with drift
  - Simulation pages: Starfield fades to focused dark background (less distraction)
  - Article pages: Subtle, slowed-down starfield (reading-friendly)
  - Competition pages: Starfield with occasional "shooting star" effects (excitement)
- **Add page-specific atmospheric overlays**:
  - Subtle gradient overlays that shift color based on content category
  - Physics pages: Purple-tinted overlay
  - Math pages: Cyan-tinted overlay
- **Performance:** Add a "reduced motion" mode that shows a static starfield image instead of canvas animation
- **Examples:** Competition countdown page with accelerating star speed. Article page with barely-moving, dimmed stars that don't compete with text.

#### AREA 6: Card & Component Design

**Current:** Rounded cards with purple borders and glow on hover. Clean but generic.

**Proposed changes:**
- **Differentiate card types visually**:
  - Simulation cards: Canvas preview thumbnail (live mini-render or screenshot)
  - Article cards: Text-heavy with subject color stripe on the left edge
  - Competition cards: Countdown timer, participant count, difficulty badge
  - Community cards: User avatar, upvote count, submission preview
- **Add micro-interactions**:
  - Cards tilt slightly on hover (3D perspective transform)
  - Skeleton loading states with purple pulse animation
  - Entry animations (staggered fade-in from bottom)
- **Improve information density**: Show tags, dates, difficulty, participant count at a glance
- **Examples:** Simulation card with a live 120x80 canvas preview of the pendulum swinging. Competition card with a magenta "3 days left" countdown badge. Article card with a cyan "Mathematics" tag and estimated read time.

#### AREA 7: Navigation & Layout

**Current:** Simple top nav with logo + links. Works but lacks personality.

**Proposed changes:**
- **Add a sidebar navigation** for desktop (collapsible) with icon + label for each section
- **Add breadcrumbs** for nested pages (Simulations > Double Pendulum > Chaos Map)
- **Add a command palette** (Ctrl+K) for power users — search simulations, articles, competitions
- **Mobile: Bottom tab bar** with 4-5 primary sections (Home, Simulations, Learn, Compete, Profile)
- **Add notification indicators** (unread count badge on competitions, new articles)
- **Examples:** Left sidebar with pixel-art icons, active section highlighted with purple glow bar. Mobile bottom bar with "Compete" tab showing "2 active" badge.

#### AREA 8: Animation & Motion Design

**Current:** CSS hover transitions, starfield drift, logo rotation. Functional but minimal.

**Proposed changes:**
- **Define motion principles**: Fast for UI feedback (150ms), medium for content transitions (300ms), slow for atmospheric effects (1s+)
- **Page transitions**: Smooth crossfade between pages (achievable with Astro View Transitions)
- **Scroll-triggered animations**: Content fades in as you scroll, parallax depth layers
- **Simulation-specific**: Particles that follow cursor on simulation pages
- **Loading states**: Skeleton screens with purple pulse animation instead of blank loading
- **Reduced motion support**: Respect `prefers-reduced-motion` media query throughout
- **Examples:** Articles slide up and fade in as you scroll. Competition countdown numbers flip like a mechanical clock. Leaderboard position changes animate with a smooth slide.

#### AREA 9: Data Visualization & Simulation UI

**Current:** Double pendulum with sliders, trail rendering, chaos map. Good but isolated.

**Proposed changes:**
- **Standardize a simulation UI framework**: Every simulation gets the same control panel layout, parameter sliders, play/pause, speed controls, download button
- **Add "share this configuration" links** — URL parameters that encode simulation state
- **Add comparison mode** — run two simulations side-by-side with different parameters
- **Interactive data readouts** — real-time graphs (energy, velocity, position over time)
- **Embed simulations in articles** — inline simulation widgets within educational content
- **Examples:** Article about chaos theory with an embedded mini double-pendulum that readers can interact with. "Share this pendulum" button generates a URL like `stemfy.gr/sim/pendulum?m1=2&L1=1.5&theta1=45`.

#### AREA 10: Community & Social UI

**Current:** No community features. Instagram is the only social layer.

**Proposed changes:**
- **User profiles**: Avatar, bio, "simulations tried," "competitions entered," badges earned
- **Submission gallery**: Grid of user-submitted simulation screenshots/configs
- **Leaderboard design**: Ranked table with avatar, username, score, trend arrow (up/down)
- **Achievement badges**: Pixel-art or geometric badges for milestones (first simulation, competition winner, 10 articles read)
- **Activity feed**: "Maria submitted a new pendulum configuration" / "New competition: Bridge Builder Challenge"
- **Examples:** Profile page with a grid of pendulum trail screenshots the user saved. Badge collection displayed as a pixel-art trophy shelf. Leaderboard with animated position changes when scores update.

---

## PART 5: PRIORITY ROADMAP

### Immediate (Weeks 1-2)
1. Set up Astro (or 11ty) to eliminate HTML duplication
2. Convert logo to SVG
3. Optimize icons (SVG conversion, reduce from 25 MB to <1 MB)
4. Commit to a typography system (Outfit + pixel font + monospace)
5. Define and document the color system with semantic roles

### Short-term (Weeks 3-6)
6. Build 2-3 more simulations (bridge builder, Mandelbrot, projectile motion)
7. Create the "Learn" section with 5-10 seed articles
8. Set up Supabase for auth and data storage
9. Build the competition/leaderboard system
10. Design and implement the new navigation (sidebar + mobile tabs)

### Medium-term (Weeks 7-12)
11. Build user profiles and submission system
12. Implement the Instagram automation pipeline (Claude API for post generation)
13. Add search functionality
14. Partnership portal for organizations
15. Full accessibility audit (WCAG AA compliance)

### Long-term (Months 4-6)
16. Mobile app (PWA or React Native)
17. Advanced community features (comments, discussions, mentorship)
18. API for external simulation embedding
19. Multilingual expansion beyond English/Greek
20. Sponsorship/sustainability model

---

*This document serves as the baseline audit and north-star proposal for STEMfy.gr's evolution from a student project to a community-driven STEM learning platform.*

---

## PART 6: CHOSEN STACK — VERIFIED FREE TIERS & IMPLEMENTATION PLAN

**Decision (2026-03-19):** Cloudflare Pages (hosting) + Supabase Free (backend) + Astro (build) + Papaki.gr (domain registrar).

---

### 6.1 Cloudflare Pages — Free Tier Verification

**Confirmed: Truly free. No credit card required. No hidden costs.**

| Resource | Free Tier Limit |
|----------|----------------|
| Bandwidth | **Unlimited** |
| Builds | 500/month (20 min timeout each) |
| Concurrent builds | 1 |
| Projects | 100 |
| Custom domains per project | 100 |
| Files per deployment | 20,000 |
| Individual file size | 25 MB max |
| Total site size | 1 GB per deployment |
| Requests | **Unlimited** |
| HTTPS/SSL | **Free** (automatic) |
| Preview deployments | **Free** |
| Custom .gr domain | **Supported on free tier** |

**What happens at limits:**
- Bandwidth: Can't exceed — it's unlimited
- 500 builds/month exceeded: Builds blocked until next month (site stays live)
- File too large: Deployment rejected (fix and redeploy)
- Site never goes down due to traffic. Cloudflare does **not** charge overages — it restricts builds, not serving.

**No gotchas found.** Custom domains, HTTPS, preview deployments, and commercial use are all included in the free tier with no payment method required.

---

### 6.2 Supabase Free Tier — Verification & Limitations

**Confirmed: Truly free. No credit card required.**

| Resource | Free Tier Limit |
|----------|----------------|
| Database storage | 500 MB |
| File storage (Supabase Storage) | 1 GB |
| Monthly Active Users (auth) | 50,000 |
| Database egress | 2 GB/month |
| File storage egress | 2 GB/month |
| Edge function invocations | 500,000/month |
| API requests | **Unlimited** (no monthly cap) |
| Read throughput | 1,200 req/sec |
| Write throughput | 1,000 req/sec |
| Individual file upload | 50 MB max |
| Free projects per account | 2 |

**The 7-day inactivity pause — how it works:**
- If your database receives **zero** API calls for 7 consecutive days, the project pauses automatically
- Supabase sends warning emails before pausing
- Any REST API call (SELECT, INSERT, etc.) counts as activity
- Unpausing takes 1–2 minutes via the dashboard
- Paused projects are restorable for 90 days; after that, data can still be downloaded but the project is deleted

**How to prevent pausing (free):**
Set up a GitHub Actions workflow that pings the database twice per week:

```yaml
# .github/workflows/supabase-keepalive.yml
name: Supabase Keepalive
on:
  schedule:
    - cron: '0 8 * * 1,4'  # Monday and Thursday at 8 AM UTC
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -s "${{ secrets.SUPABASE_URL }}/rest/v1/" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

**Will free tier work for STEMfy.gr (50–200 initial users)?**
Yes, comfortably:
- 50,000 MAU limit vs ~200 users = 250x headroom
- 500 MB database = enough for thousands of articles, scores, and submissions (text is small)
- 1 GB file storage = enough for ~1,000 simulation screenshots at 1 MB each
- Unlimited API requests = no rate limit concerns
- The main constraint is **storage** — if you store lots of media, you'll hit 500 MB / 1 GB first

**When to upgrade to Pro ($25/month):**
- When database exceeds 500 MB
- When you need guaranteed uptime (no pause risk)
- When file storage exceeds 1 GB
- Realistically: months after launch, not at start

---

### 6.3 How Astro Works — Implementation Detail

#### What Astro does

Astro is a **static site generator** (SSG). It takes template files with shared components and builds them into plain HTML/CSS/JS — exactly like your current site, but generated from a single source of truth instead of copy-pasted across 9 files.

```
WHAT YOU WRITE:                    WHAT ASTRO BUILDS:
                                   (output in dist/)
src/layouts/Base.astro
  ├── Nav component                index.html  ← full HTML with nav, footer, starfield
  ├── Starfield component          about.html  ← same shared elements, different content
  ├── Footer component             simulations.html
  └── i18n setup                   double-pendulum.html
                                   posts.html
src/pages/index.astro              news.html
src/pages/about.astro              challenges.html
src/pages/simulations.astro        contact.html
...etc                             404.html

src/styles/global.css              css/global.css  ← bundled & minified
src/js/starfield.js                js/starfield.js ← optimized
```

The output (`dist/` folder) is **identical in nature** to what you have now — static HTML files. No server runtime needed. Deployable anywhere.

#### What changes for you

| Aspect | Today | With Astro |
|--------|-------|------------|
| Editing the nav | Edit 9 HTML files | Edit 1 component (`Nav.astro`) |
| Adding a new page | Copy-paste 100+ lines of boilerplate | Create a 10-line `.astro` file |
| CSS/JS optimization | None (raw files) | Auto-minified and bundled |
| Image optimization | Manual (25 MB of PNGs) | Auto-compressed at build time |
| Development server | `python -m http.server` | `npm run dev` (hot reload) |
| Building for production | Not needed (raw files) | `npm run build` → `dist/` folder |

#### Your existing code works as-is

Astro's "islands architecture" means:
- **Your starfield canvas JS** → works unchanged (loaded as a `<script>` tag)
- **Your double-pendulum simulation** → works unchanged (loaded as a `<script>` tag)
- **Your CSS** → works unchanged (imported in the layout)
- **Your i18n system** → works unchanged (client-side JS)

No React, no Vue, no framework needed. Astro wraps your existing vanilla JS/HTML/CSS in a component system for reuse, then gets out of the way.

#### Proposed Astro project structure

```
stemfy.gr/
├── src/
│   ├── layouts/
│   │   └── Base.astro              # THE shared layout (nav + starfield + footer + i18n)
│   │
│   ├── components/
│   │   ├── Nav.astro               # Navigation bar (written once)
│   │   ├── Footer.astro            # Footer (written once)
│   │   ├── SettingsModal.astro     # Language/theme settings (written once)
│   │   ├── Starfield.astro         # Canvas starfield wrapper
│   │   ├── SimulationCard.astro    # Reusable card for simulation listings
│   │   ├── ArticleCard.astro       # Reusable card for articles
│   │   ├── CompetitionCard.astro   # Reusable card for competitions
│   │   └── LeaderboardTable.astro  # Leaderboard display component
│   │
│   ├── pages/
│   │   ├── index.astro             # Home page
│   │   ├── about.astro             # About page
│   │   ├── contact.astro           # Contact page
│   │   ├── posts.astro             # Instagram-style posts
│   │   ├── news.astro              # News/events
│   │   ├── 404.astro               # Error page
│   │   ├── simulations/
│   │   │   ├── index.astro         # Simulation catalog
│   │   │   └── double-pendulum.astro
│   │   ├── learn/
│   │   │   ├── index.astro         # Articles hub
│   │   │   └── [slug].astro        # Dynamic article pages
│   │   └── competitions/
│   │       ├── index.astro         # Competition listing
│   │       └── [slug].astro        # Individual competition + leaderboard
│   │
│   ├── simulations/                # Simulation JS (your existing code)
│   │   ├── double-pendulum/
│   │   │   ├── physics.js          # RK4 engine (extracted from double-pendulum.js)
│   │   │   ├── renderer.js         # Canvas rendering
│   │   │   ├── controls.js         # UI controls
│   │   │   ├── chaos-map.js        # Chaos map visualization
│   │   │   └── tutorial.js         # Guided walkthrough
│   │   └── [future-simulations]/
│   │
│   ├── lib/
│   │   ├── supabase.js             # Supabase client initialization
│   │   ├── auth.js                 # Auth helper functions
│   │   └── i18n.js                 # Internationalization (migrated)
│   │
│   ├── styles/
│   │   ├── global.css              # CSS variables, resets, typography
│   │   ├── components.css          # Shared component styles
│   │   └── simulations.css         # Simulation-specific styles
│   │
│   └── i18n/
│       ├── en.json                 # English translations
│       └── el.json                 # Greek translations
│
├── public/
│   ├── assets/
│   │   ├── logo.svg                # SVG version of logo (to be created)
│   │   ├── logo.png                # Current PNG (fallback)
│   │   └── pfp.jpg                 # Profile picture
│   ├── icons/                      # Optimized SVG icons (replacing 25 MB of PNGs)
│   └── fonts/                      # Self-hosted fonts (optional, for performance)
│
├── astro.config.mjs                # Astro configuration
├── package.json
└── .github/
    └── workflows/
        ├── deploy.yml              # Auto-deploy to Cloudflare on push
        └── supabase-keepalive.yml  # Prevent Supabase free tier pausing
```

#### How a page looks in Astro

**Base layout** (`src/layouts/Base.astro`) — written once, used everywhere:
```astro
---
// Base.astro — the shared skeleton for every page
const { title, description } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title} | STEMfy.gr</title>
  <meta name="description" content={description}>
  <link rel="icon" type="image/png" href="/assets/logo.png">
</head>
<body>
  <Nav />
  <canvas id="starfield"></canvas>
  <SettingsModal />

  <main>
    <slot />   <!-- Page-specific content goes here -->
  </main>

  <Footer />
  <script src="/js/starfield.js"></script>
  <script src="/js/i18n.js"></script>
</body>
</html>
```

**A page** (`src/pages/about.astro`) — just the unique content:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="About" description="About STEMfy.gr">
  <section class="about-hero">
    <h1>Three minds. One mission.</h1>
    <p>We are three students exploring the world of STEM...</p>
  </section>
</Base>
```

That's it. ~10 lines per page instead of 100+ lines of duplicated boilerplate. The nav, footer, starfield, settings modal, and meta tags are inherited from the layout.

#### The development workflow

**Local development:**
```bash
npm run dev          # Starts dev server at localhost:4321
                     # Hot reload — edit a file, browser updates instantly
```

**Building for production:**
```bash
npm run build        # Generates static HTML in dist/
npm run preview      # Preview the built site locally
```

**Deploying:**
```bash
git add . && git commit -m "Update about page"
git push origin main
# Cloudflare auto-detects push → builds → deploys in ~3 min
# Site live at stemfy.gr
```

---

### 6.4 Complete Pipeline — How Everything Connects

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR DEVELOPMENT WORKFLOW                    │
│                                                                  │
│  1. Edit code locally (VS Code, etc.)                           │
│  2. npm run dev → test at localhost:4321                        │
│  3. git push origin main                                        │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────┐                                │
│  │       GitHub Repository      │                                │
│  │   PastelDev/Stemfy_website   │                                │
│  └──────────┬──────────────────┘                                │
│             │                                                    │
│      webhook fires                                               │
│             │                                                    │
│             ▼                                                    │
│  ┌─────────────────────────────┐                                │
│  │     Cloudflare Pages         │                                │
│  │                              │                                │
│  │  npm install                 │                                │
│  │  npm run build (Astro)       │                                │
│  │  Upload dist/ to CDN         │                                │
│  │                              │                                │
│  │  Live at: stemfy.gr          │                                │
│  │  Preview: pr-42.pages.dev    │                                │
│  └─────────────────────────────┘                                │
│                                                                  │
│                                                                  │
│  ┌─────────────────────────────┐    ┌────────────────────────┐  │
│  │     Supabase (Free)          │    │   Admin Panel           │  │
│  │                              │    │   (Motor Admin or       │  │
│  │  PostgreSQL database         │◄───│    custom /admin page)  │  │
│  │  ├── users (auth)            │    │                         │  │
│  │  ├── articles                │    │  Create articles        │  │
│  │  ├── competitions            │    │  Manage competitions    │  │
│  │  ├── leaderboard_scores      │    │  Review submissions     │  │
│  │  ├── submissions             │    │  Moderate content       │  │
│  │  └── posts                   │    └────────────────────────┘  │
│  │                              │                                │
│  │  Supabase Storage            │                                │
│  │  ├── simulation-screenshots  │                                │
│  │  ├── post-media              │                                │
│  │  └── user-avatars            │                                │
│  │                              │                                │
│  │  Supabase Auth               │                                │
│  │  ├── Email/password signup   │                                │
│  │  ├── Admin role management   │                                │
│  │  └── Row-Level Security      │                                │
│  └─────────────────────────────┘                                │
│                                                                  │
│                                                                  │
│  ┌─────────────────────────────┐                                │
│  │     Papaki.gr (unchanged)    │                                │
│  │                              │                                │
│  │  Domain registrar only       │                                │
│  │  DNS points to Cloudflare    │                                │
│  │  stemfy.gr → CF Pages        │                                │
│  └─────────────────────────────┘                                │
│                                                                  │
│                                                                  │
│  ┌─────────────────────────────┐                                │
│  │   GitHub Actions (free)      │                                │
│  │                              │                                │
│  │  supabase-keepalive.yml      │                                │
│  │  Pings DB every Mon & Thu    │                                │
│  │  Prevents free tier pause    │                                │
│  └─────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Admin Panel — How It Works with Supabase

The current PHP admin panel (`/admin/`) reads/writes JSON files. With Supabase, the admin panel becomes a web interface that talks to the database via API.

**Three options, from simplest to most custom:**

**Option A: Supabase Dashboard directly (developer only)**
- Log into supabase.com → open your project → Table Editor
- Spreadsheet-like view of all tables
- Inline editing, filtering, sorting
- Good for: Quick data fixes, the developer on the team
- Not good for: Non-technical team members

**Option B: Motor Admin (free, auto-generated)**
- Open-source tool that auto-generates an admin UI from your database schema
- Connect with your Supabase connection string
- Gets: forms for creating articles, tables for viewing submissions, filters for moderation
- Self-hosted (run on your machine or a small server)
- Good for: Small team, quick setup, non-technical admins

**Option C: Custom admin pages in Astro (full control)**
- Build `/admin/` pages as part of your Astro site
- Protected by Supabase Auth (admin role check)
- Custom forms with rich text editors, file uploaders, competition builders
- More work to build but exactly matches your workflow
- Good for: Long-term, when you know exactly what admin features you need

**Recommended path:** Start with Option A (Supabase Dashboard) for the developer, add Option B (Motor Admin) when non-technical team members need access, build Option C later when you have specific workflow requirements.

### 6.6 Monthly Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| Cloudflare Pages | $0 | Unlimited bandwidth, no credit card |
| Supabase Free | $0 | 500 MB DB, 1 GB storage, 50k MAU |
| Papaki.gr | ~$15/year | Domain registration only |
| GitHub | $0 | Free for public/private repos |
| GitHub Actions | $0 | 2,000 min/month free (keepalive uses ~1 min/month) |
| **Total at launch** | **~$1.25/month** | (just domain cost amortized) |
| **Total when scaling** | **~$26.25/month** | (Supabase Pro at $25/mo when needed) |
