# STEMfy.gr Refactor & Astro Migration Plan

## 1. Purpose

This plan translates the findings from the new audit documents into a practical refactor and migration roadmap for the current STEMfy.gr codebase.

The goals are to improve:

- **code quality** through modular architecture and consistent conventions,
- **maintainability** through reusable layouts, components, and typed content boundaries,
- **interpretability** through clearer file ownership, naming, and documentation,
- **scalability** through a modern content pipeline and cleaner separation between static content, interactive simulations, and admin workflows.

This plan assumes the current site remains visually recognizable — dark cosmic branding, purple-magenta palette, bilingual support, and simulation-first identity — while the implementation moves from hand-maintained static pages to an Astro-based architecture.

---

## 2. Inputs Used

This plan is based on:

1. `AUDIT_AND_PROPOSAL.md`, which identifies the major architectural weaknesses (HTML duplication, monolithic simulation code, no build system, JSON storage limits, and asset bloat) and proposes Astro as the short-term direction.
2. `docs/website-brand-product-audit.md`, which clarifies the desired product direction: preserve the brand identity, strengthen content structure, improve community/competition systems, and evolve from prototype to platform.
3. The current repository structure, which shows a raw multi-page static site, shared styling in large CSS files, large vanilla JS files, and a PHP + JSON admin layer.

---

## 3. Current-State Diagnosis

### 3.1 Structural problems in the current codebase

The current implementation is functional, but it has several structural issues that will make future growth expensive:

- **Shared UI is duplicated across pages.** Navigation, footer, settings UI, shared meta structure, and starfield setup are repeated manually in multiple HTML files.
- **There is no build pipeline.** Assets are served directly with no bundling, image processing, CSS splitting, typed validation, or deployment safeguards.
- **Core frontend files are too large.** The project currently relies on very large files such as `js/double-pendulum.js`, `js/i18n.js`, `css/main.css`, and `css/simulations.css`, which increases cognitive load and makes safe changes harder.
- **Content and rendering are loosely coupled.** Static page structure, translated strings, and content data are mixed together rather than flowing through a clear content model.
- **The admin system is isolated from the frontend architecture.** PHP pages write JSON files, but the public site does not yet have a robust content ingestion model or schema validation layer.
- **The asset system is inconsistent.** Heavy PNG-based icons and logo assets reduce performance and make brand scaling harder.

### 3.2 Product and brand problems reflected in the implementation

The audit documents also show non-code issues that should influence the migration plan:

- The site has **strong identity but shallow content depth**.
- The product promise is broader than the implementation: simulations, posts, news, challenges, resources, and community are present conceptually but not yet unified as a platform.
- The site’s best differentiator is **interactive understanding**, especially simulations, not just static content.
- The visual system is promising but still **underspecified as a reusable design system**.

### 3.3 Why Astro is the right migration target

Astro fits this project well because it allows STEMfy to:

- keep a mostly static, performance-friendly site,
- preserve vanilla JS where it is already working well,
- introduce reusable layouts/components without forcing a full SPA rewrite,
- support content collections for posts, news, resources, and challenge metadata,
- progressively hydrate only the interactive parts that need client-side behavior,
- create a cleaner boundary between content, presentation, and simulation logic.

---

## 4. Refactor Objectives

### 4.1 Primary objectives

1. **Remove duplication** across HTML, CSS, and JS.
2. **Modularize simulations** so complex interactive code can evolve safely.
3. **Formalize content models** for bilingual content, posts, resources, news, and challenges.
4. **Create a scalable design system** from the existing visual identity.
5. **Reduce performance overhead** from oversized assets and unstructured loading.
6. **Prepare the codebase for future product features** such as competitions, submissions, and richer content publishing.

### 4.2 Non-goals for the first migration

To avoid over-scoping, the initial Astro migration should **not** attempt to solve everything at once. Phase 1 should not include:

- a full user account system,
- a database-backed community platform,
- a complete rewrite of the PHP admin in the first pass,
- a complete redesign of the STEMfy visual identity.

The first milestone should focus on a safer architecture and cleaner content pipeline while preserving the current public experience.

---

## 5. Target Architecture

## 5.1 Proposed high-level structure

```text
src/
  components/
    layout/
    navigation/
    footer/
    ui/
    content/
    simulation/
  layouts/
    BaseLayout.astro
    ContentLayout.astro
    SimulationLayout.astro
  pages/
    index.astro
    about.astro
    contact.astro
    simulations/
      index.astro
      [slug].astro
    posts/
      index.astro
      [slug].astro
    news/
      index.astro
      [slug].astro
    challenges/
      index.astro
      [slug].astro
  content/
    posts/
    news/
    resources/
    challenges/
    simulations/
  data/
    navigation.ts
    site.ts
    social.ts
  i18n/
    en.ts
    el.ts
  lib/
    content/
    i18n/
    seo/
    analytics/
    cms/
  styles/
    tokens.css
    base.css
    utilities.css
    components/
public/
  assets/
  icons/
  fonts/
admin/
  ...existing PHP admin (temporarily retained)
```

### 5.2 Architectural principles

- **Astro for page composition** and routing.
- **Content collections** for structured content and schema validation.
- **Islands architecture** only for truly interactive UI.
- **Vanilla JS modules** retained where appropriate, especially for simulation logic.
- **Design tokens** extracted from the current visual system.
- **Separation of concerns** between content, page composition, simulation engine code, and admin ingestion.

### 5.3 Key migration decision

The double-pendulum simulation should **not** be rewritten immediately into a framework-specific component. Instead:

- keep the simulation engine in vanilla JS,
- split it into focused modules,
- mount it inside an Astro page/component boundary,
- add typed configuration and documented public APIs around it.

This approach lowers migration risk while still improving maintainability.

---

## 6. Workstreams

## 6.1 Workstream A — Information architecture and content model

### Goals

- Standardize site structure.
- Make content types explicit.
- Support bilingual content cleanly.

### Actions

1. Define canonical content types:
   - pages,
   - posts,
   - news,
   - resources,
   - challenges,
   - simulations.
2. Decide which items are:
   - static site content,
   - admin-managed JSON-fed content,
   - future database-backed content.
3. Create schemas for each content type with required fields such as:
   - `slug`,
   - `title`,
   - `summary`,
   - `locale`,
   - `publishedAt`,
   - `status`,
   - `tags`,
   - `heroImage`,
   - optional SEO metadata.
4. Establish a bilingual content strategy:
   - either parallel localized documents,
   - or a single canonical item with `en`/`el` fields,
   - but avoid scattered ad-hoc translation keys for long-form content.
5. Unify navigation labels, section naming, and route naming.
6. Define a legacy-to-new URL compatibility matrix so every current `.html` entry point has either a stable alias or an explicit redirect target in the Astro route map.

### Deliverables

- Content model specification.
- Route map.
- Legacy URL redirect/alias matrix for existing `.html` pages and high-value inbound links.
- Frontmatter/schema definitions.
- Editorial conventions for bilingual publishing.

---

## 6.2 Workstream B — Layout and component system

### Goals

- Remove repeated HTML structure.
- Centralize shared UI.
- Improve interpretability of the frontend.

### Actions

1. Create a **BaseLayout** that owns:
   - document shell,
   - global metadata,
   - fonts,
   - theme classes,
   - shared scripts,
   - starfield mounting.
2. Extract reusable components for:
   - header/navigation,
   - footer,
   - language switcher,
   - settings modal,
   - CTA cards,
   - section headers,
   - content cards,
   - badges/tags,
   - simulation control panels.
3. Split layout concerns into page types:
   - marketing/content pages,
   - simulation pages,
   - collection index pages.
4. Replace page-by-page duplication with data-driven rendering for menus, links, and cards.

### Deliverables

- Shared Astro layouts.
- Reusable UI components.
- Navigation/footer config files.

---

## 6.3 Workstream C — Design system and styling refactor

### Goals

- Turn the current brand language into a maintainable design system.
- Reduce CSS sprawl and styling ambiguity.

### Actions

1. Extract design tokens from current styles:
   - color tokens,
   - spacing scale,
   - border radii,
   - shadows/glows,
   - typography scale,
   - z-index layers,
   - motion timings.
2. Split CSS into clear layers:
   - tokens,
   - reset/base,
   - layout utilities,
   - components,
   - simulation-specific styles.
3. Formalize typography usage:
   - Outfit as the primary UI/content font,
   - pixel/mono accent usage only where it adds identity,
   - clear heading/body/label hierarchy.
4. Standardize icon usage into:
   - UI icons,
   - category icons,
   - social/illustration assets.
5. Introduce responsive rules from a single breakpoint strategy rather than page-local overrides.

### Deliverables

- Token file(s).
- Component-level styles.
- Lightweight design-system documentation.

---

## 6.4 Workstream D — Simulation architecture refactor

### Goals

- Preserve the quality of the current simulation while making it understandable and extensible.

### Actions

1. Split the double-pendulum implementation into modules such as:
   - physics engine/integration,
   - rendering,
   - state store,
   - controls,
   - presets,
   - tutorial/onboarding,
   - exports/downloads,
   - chaos map generation,
   - mobile adaptations.
2. Define a clear public API for simulation bootstrapping:
   - container element,
   - initial parameters,
   - callbacks/events,
   - localization inputs.
3. Move simulation constants and presets into configuration files.
4. Add inline documentation for mathematical/model assumptions.
5. Prepare a shared simulation framework so future simulations (Bridge Builder, Mandelbrot) can reuse:
   - page shell,
   - control patterns,
   - download/export patterns,
   - tutorial structure.

### Deliverables

- Modular simulation folder structure.
- Documented bootstrap interface.
- Reusable simulation page template.

---

## 6.5 Workstream E — Internationalization redesign

### Goals

- Keep bilingual support strong while reducing translation complexity.

### Actions

1. Separate **UI string translations** from **long-form content translations**.
2. Replace the giant translation surface with structured locale modules.
3. Define a route strategy for localization, for example:
   - `/en/...` and `/el/...`, or
   - locale-aware rendering with deterministic canonical URLs.
4. Ensure language selection affects:
   - navigation,
   - metadata,
   - structured content,
   - simulation labels,
   - fallback behavior.
5. Add validation to prevent missing translation keys.

### Deliverables

- Locale module structure.
- Localized route plan.
- Translation quality checklist.

---

## 6.6 Workstream F — CMS and publishing pipeline

### Goals

- Keep the current admin usable while creating a cleaner path into the Astro frontend.

### Actions

1. Audit the JSON outputs used by the PHP admin.
2. Define a stable ingestion contract between admin-generated data and Astro content/data loaders.
3. Decide whether the near-term source of truth is:
   - markdown/content collections,
   - JSON generated by admin,
   - or a hybrid model.
4. Add schema validation for imported admin data.
5. Normalize media handling paths and metadata.
6. Create a migration path from the current PHP+JSON admin to one of:
   - retained lightweight admin + generated content,
   - headless CMS,
   - custom Astro-compatible editorial workflow.

### Deliverables

- Content ingestion spec.
- Validation layer for admin JSON.
- Recommendation memo for future CMS direction.

---

## 6.7 Workstream G — Performance and asset optimization

### Goals

- Improve loading performance without losing the visual identity.

### Actions

1. Convert brand/logo assets to SVG where possible.
2. Audit large PNG icons and replace/compress them using:
   - SVG for simple assets,
   - WebP/AVIF for bitmap assets.
3. Use Astro’s asset pipeline for image sizing and responsive delivery where applicable.
4. Lazy-load non-critical media.
5. Ensure the starfield and simulation scripts only initialize where needed.
6. Review font loading strategy and eliminate unused font declarations.

### Deliverables

- Asset optimization checklist.
- Reduced media footprint.
- Performance budget targets.

---

## 6.8 Workstream H — Quality, tooling, and governance

### Goals

- Establish the engineering baseline the current project is missing.

### Actions

1. Introduce a Node-based project toolchain with Astro.
2. Add:
   - formatter,
   - linter,
   - basic type checking,
   - content/schema validation,
   - build verification.
3. Define conventions for:
   - naming,
   - file organization,
   - component ownership,
   - content review,
   - translation updates.
4. Add CI checks for:
   - install,
   - lint,
   - build,
   - content validation.
5. Create lightweight technical documentation for contributors.

### Deliverables

- Tooling baseline.
- CI workflow.
- Contribution and architecture docs.

---

## 7. Migration Phases

## Phase 0 — Discovery and stabilization

### Objective
Document what exists and reduce migration ambiguity.

### Tasks

- Inventory all public routes, shared sections, scripts, and admin data files.
- Freeze current page scope and identify obsolete pages/links.
- Define success metrics for migration.
- Decide route naming and localization strategy.

### Outcome
A stable migration map with reduced hidden dependencies.

---

## Phase 1 — Astro foundation and design-system extraction

### Objective
Create the new architectural skeleton without changing the product significantly.

### Tasks

- Initialize Astro project structure.
- Build base layout and global styles.
- Extract navigation, footer, settings, and starfield into reusable parts.
- Port core static pages first:
  - home,
  - about,
  - contact,
  - simulations index.
- Define content collections and locale modules.

### Outcome
The public site shell becomes maintainable even before all features are migrated.

---

## Phase 2 — Content migration and routing cleanup

### Objective
Move content-driven sections into structured collections.

### Tasks

- Migrate posts, news, resources, and challenge metadata into validated models.
- Create reusable listing/detail templates.
- Normalize slugs, metadata, and translations.
- Introduce SEO defaults and structured page metadata.
- Ship a redirect/alias plan for legacy URLs (for example `double-pendulum.html`, `simulations.html`, and other current root pages) so inbound links, internal hard-links, and shared social URLs continue to resolve after the new route structure lands.
- Keep admin-published content on a live path during the transition by choosing one of two supported modes per content type: runtime reads from `admin/api.php` through an Astro server endpoint/adapter, or publish-triggered rebuilds/webhooks with clear editorial expectations.

### Outcome
Content becomes scalable and easier to publish consistently.

---

## Phase 3 — Simulation migration and modularization

### Objective
Move the flagship simulation into the Astro architecture safely.

### Tasks

- Wrap current simulation in an Astro page.
- Split `double-pendulum.js` into modules.
- Refactor simulation styling into scoped or organized global layers.
- Introduce reusable patterns for future simulations.

### Outcome
The strongest product feature is preserved while becoming easier to extend.

---

## Phase 4 — Admin integration and publishing workflow hardening

### Objective
Connect editorial workflows to the new frontend cleanly.

### Tasks

- Build loaders/adapters for admin JSON.
- Add schema validation and error handling.
- Align media paths and content states.
- Decide whether to retain, replace, or phase out the PHP admin.
- If collections are build-time sourced, add a rebuild trigger/webhook from the admin publish flow; if live runtime fetching is retained, define caching, fallback, and failure behavior so editors still see newly published entries immediately.
- Document the publishing contract end-to-end: where content is authored, when it becomes visible on the public site, and how rollback/revalidation works.

### Outcome
Publishing becomes more reliable and less ad hoc.

---

## Phase 5 — Performance, QA, and future-platform readiness

### Objective
Complete optimization and prepare for broader platform growth.

### Tasks

- Optimize images and fonts.
- Add regression checks and content QA.
- Improve accessibility and mobile polish.
- Prepare extension points for leaderboards, submissions, and community features.

### Outcome
The project is ready to scale beyond a polished prototype.

---

## 8. Recommended Priorities

If the team wants the highest return with limited time, prioritize work in this order:

1. **Layout/component extraction into Astro**
2. **Content modeling and route cleanup**
3. **Simulation modularization**
4. **Asset optimization**
5. **Admin/frontend contract cleanup**
6. **Tooling and CI hardening**

This order removes the most recurring maintenance pain first while keeping the flagship simulation and brand intact.

---

## 9. Risks and Mitigations

### Risk 1 — Over-rewriting too early
Trying to redesign the site, rewrite the simulation, and replace the CMS all at once could stall delivery.

**Mitigation:** keep the first migration incremental; preserve working logic where possible.

### Risk 2 — Breaking bilingual behavior
Migration may unintentionally regress English/Greek switching.

**Mitigation:** define localization strategy before page migration and validate page-by-page.

### Risk 3 — Losing brand character during cleanup
A generic component system could flatten the visual identity.

**Mitigation:** extract design tokens from the current brand instead of replacing the brand language.

### Risk 4 — Content model mismatch with admin data
The PHP admin and Astro collections may diverge in structure.

**Mitigation:** define an explicit ingestion contract and validation layer before integration.

### Risk 5 — Simulation regressions
Refactoring a large simulation without boundaries could break behavior subtly.

**Mitigation:** modularize around stable behavior, add smoke tests/checklists, and avoid logic rewrites unless necessary.

### Risk 6 — Breaking inbound links during route cleanup
Moving from root `.html` files to collection-style routes can strand existing bookmarks, internal links, and social shares if compatibility work is skipped.

**Mitigation:** approve a redirect matrix before implementation, keep stable aliases for critical pages where useful, and test the highest-traffic legacy URLs before launch.

### Risk 7 — Delaying admin-authored content visibility
A pure build-time collection setup can make newly published posts/news/resources invisible until the next deploy.

**Mitigation:** preserve a live runtime path or add publish-triggered rebuild automation, and document the expected freshness SLA for editors.

---

## 10. Definition of Done

The migration should be considered successful when:

- the site runs on Astro-based page composition,
- shared UI is no longer duplicated across pages,
- major content types have validated schemas,
- bilingual behavior is deterministic and maintainable,
- legacy URLs have tested redirects or aliases to their new canonical routes,
- the double-pendulum simulation is integrated through a modular structure,
- admin-authored content has a documented live-publication path (runtime fetch or automated rebuild) with no ambiguous delay window,
- asset performance is improved measurably,
- the repo has a documented build/lint/check workflow,
- future simulations and content sections can be added without copy-pasting entire pages.

---

## 11. Immediate Next Steps

1. Approve the target route map and localization approach.
2. Decide the near-term source of truth for content: Markdown, admin JSON, or hybrid.
3. Initialize the Astro project skeleton in a migration branch.
4. Port the shared site shell before porting feature-heavy pages.
5. Treat the double-pendulum page as a controlled second-stage migration, not the first page to rewrite.

---

## 12. Expected Result

Following this plan should transform STEMfy from a visually strong but structurally fragile prototype into a maintainable, interpretable, and scalable platform.

The key principle is: **preserve the identity, refactor the architecture, and migrate incrementally**.
