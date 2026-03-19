# STEMfy.gr — Website, Visual Identity, and Product Audit

_Last updated: 2026-03-18_

## 1. Purpose of this document

This document captures the **current identity, product scope, technical setup, and growth opportunities** of STEMfy.gr based on the repository contents, uploaded media assets, and current post/news data.

It is intended to serve as a baseline before a broader redesign and product expansion.

---

## 2. Executive summary

STEMfy currently presents itself as a **small but ambitious science-learning brand** with a clear early-stage identity:

- **Theme:** galaxy / space / chaos / science exploration.
- **Tone:** youthful, curious, educational, slightly playful, mission-driven.
- **Visual core:** dark space background, purple-magenta glow palette, soft glassmorphism panels, rounded cards, science icons, and one highly interactive flagship simulation.
- **Brand promise:** “STEM, for you.” and “Make STEM Addictive!”
- **Current product center of gravity:** a static multi-page website with one advanced simulation, a lightweight content system, challenge pages, competition information, and Instagram-linked publishing.

The current identity is already distinctive enough to build on. The main challenge is not lack of style; it is that the site is still in a **foundational / prototype-to-platform transition stage**.

The next evolution should preserve the cosmic STEM personality while improving:

1. **content structure**,
2. **community features**,
3. **competition and leaderboard systems**,
4. **resource publishing workflows**,
5. **visual hierarchy and maturity**, and
6. **scalability of the technical architecture**.

---

## 3. Current visual identity

## 3.1 Brand personality

The current brand feels like a blend of:

- **science club / student lab**,
- **space exploration interface**,
- **modern educational microsite**,
- **interactive experiment playground**.

It does **not** feel corporate, institutional, or textbook-like. Instead, it feels:

- approachable,
- energetic,
- curious,
- digitally native,
- visually immersive.

That is a strength. It makes the brand more memorable for students and young learners.

## 3.2 Core visual language

The current visual identity is built from five recurring ingredients:

### A. Dark cosmic foundation
A near-black / deep-indigo background creates a “space lab” atmosphere.

### B. Purple-first accent system
The site consistently uses lavender, violet, pink-magenta, and occasional cyan accents. This gives the site a signature look and differentiates it from the common blue-only STEM aesthetic.

### C. Pixel-like starfield motion
The animated starfield gives the site motion and atmosphere without feeling heavy or cluttered. It introduces a subtle pixel / retro-computing flavor.

### D. Rounded glass panels
Cards, modal windows, simulation panels, and content blocks use translucent dark surfaces with soft borders and glow, which reads as modern and interactive.

### E. Science-symbol iconography
The icons and uploaded visual assets communicate different STEM domains in a way that feels accessible and social-media-friendly.

---

## 4. Visual assets inventory and interpretation

## 4.1 Logo

### What exists now
- Main logo file: `assets/logo.png`
- Reused as favicon and in navigation across pages.
- Rendered inside a circular frame with glow and border.

### Identity interpretation
The logo is currently treated less like a formal corporate seal and more like a **social-native emblem**:

- circular,
- compact,
- easy to reuse in nav, profile, and favicon contexts,
- visually compatible with Instagram profile culture.

### Strengths
- Works well in small UI placements.
- Feels friendly rather than overly formal.
- Sits naturally inside the cosmic UI system.

### Risks / opportunities
- The logo system appears to rely mostly on a single raster asset. That can become limiting for:
  - hero lockups,
  - print / high-res usage,
  - monochrome variants,
  - animation,
  - social templates.

### Recommendation
Create a full logo system:
- primary logo,
- icon-only mark,
- horizontal wordmark,
- monochrome light version,
- monochrome dark version,
- SVG master files,
- social avatar-safe variant.

## 4.2 Typography

### Current usage
The website primarily uses **Outfit** as the main display and body font.
A secondary monospace presence appears in the homepage font import via **Space Mono**, while a pixel-font token (`Press Start 2P`) exists in CSS variables but is not yet central to the live UI.

### Identity interpretation
Outfit gives the site:
- softness,
- geometric clarity,
- modernity,
- friendliness,
- readability on both marketing pages and controls.

This is a good choice for a science-learning brand because it does not feel cold.

### Opportunity
If the desired direction is “a bit pixelated, but overall clean and professional,” the strongest path is **not** to replace Outfit. Instead:

- keep Outfit as the main UI/content font,
- introduce a restrained secondary pixel/mono layer for labels, badges, data chips, tabs, coordinates, challenge scores, and section overlines.

That would preserve readability while strengthening distinctiveness.

## 4.3 Color system

### Current palette impression
The effective palette is approximately:

- deep background black / indigo,
- muted purple surfaces,
- bright lavender highlight,
- pink-magenta action accent,
- white/off-white text,
- occasional cyan secondary accent.

### Identity interpretation
This palette communicates:
- STEM through cool/digital tones,
- creativity through magenta,
- mystery/exploration through deep-space backgrounds,
- youthfulness through glow rather than severe contrast.

### Strategic note
The palette is one of the most ownable parts of the current brand. It should be refined, not discarded.

## 4.4 Starfield background

### What it currently does
The starfield is a canvas-based background made of hundreds of square-like stars with size, opacity, and color variation and slow drifting motion.

### Why it matters
This is one of the strongest identity anchors because it creates:
- immersion,
- immediate recognizability,
- motion without distracting the user,
- a subtle bridge between science and retro-digital aesthetics.

### Interpretation
It suggests:
- astronomy,
- possibility,
- systems thinking,
- exploration,
- a “science universe” rather than just a plain educational website.

### Opportunity
The starfield can become a **brand motion system**, not just a background. It could evolve into:
- page-specific constellations,
- subject-specific star clusters,
- subtle parallax layers,
- competition celebration effects,
- branded loading states,
- post-template backgrounds for social content.

## 4.5 Icons used

### Current asset families
There are at least two icon families in use:

1. **Homepage / navigation icons**
   - rocket,
   - news,
   - trophy,
   - heart.

2. **Subject / social asset icons**
   - science,
   - math,
   - engineering,
   - philosophy,
   - technology & AI,
   - atom,
   - gear,
   - flask,
   - owl,
   - chip,
   - brain,
   - pi.

### Identity interpretation
These icons make the brand feel:
- interdisciplinary,
- explainable,
- content-friendly,
- suitable for both web cards and Instagram graphics.

### Issue
The current icon ecosystem is thematically coherent but may not yet be stylistically unified enough across all assets. Some feel like UI icons, some feel like social graphics, and some feel like category illustrations.

### Recommendation
Formalize icons into three layers:
- **UI icons**: simple, minimal, line/duotone, consistent stroke rules.
- **Category icons**: slightly more expressive but still systematic.
- **Social illustrations**: richer compositions for Instagram/video thumbnails.

## 4.6 Simulations approach

### Current approach
The simulation layer is not decorative; it is a key part of the product identity.

The double pendulum page presents STEMfy as a place where users:
- experiment,
- manipulate parameters,
- visualize complex behavior,
- explore chaos interactively,
- learn through direct interaction.

### Identity meaning
This is excellent brand positioning. It makes the platform more than a content feed.

STEMfy’s strongest differentiator is likely **interactive understanding**, not just explanatory posting.

### Current simulation style
The current simulation approach combines:
- elegant dark UI panels,
- clear scientific controls,
- responsive adaptation for mobile,
- visual exports,
- challenge hooks,
- tutorial/onboarding support.

This feels closer to an “interactive science studio” than a normal club website.

---

## 5. Instagram / uploaded social content: current state

## 5.1 What is currently present in the repository

The repository currently shows a limited but meaningful set of social media assets:

- one stored post entry in `admin/data/posts.json`,
- an uploaded MP4 for that first post,
- a preview image,
- supporting graphic/video assets such as `First_post_video.mp4`, `First_post_image_preview.jpg`, `Galaxy_with_icons.mp4`, and multiple STEM category icon images.

## 5.2 What the first stored post communicates

The first stored Instagram-style post establishes the channel as:
- student-led,
- broad across STEM domains,
- occasionally philosophical,
- interactive,
- educational,
- community-oriented,
- event and competition aware.

That message is aligned with the website’s direction.

## 5.3 Social identity emerging from the uploaded assets

The uploaded media suggests that the Instagram side currently leans on:
- cosmic or galaxy visuals,
- symbolic STEM icon arrangements,
- intro / launch style content,
- broad brand-establishment posts rather than deep recurring content series.

## 5.4 Social-media opportunity

A stronger Instagram system could be built around recurring formats such as:

- **simulation spotlight**,
- **concept in 3 slides**,
- **competition alert**,
- **resource drop**,
- **weekly challenge**,
- **student project spotlight**,
- **today in science**,
- **chaos / pattern of the week**,
- **community leaderboard snapshot**.

This would make Instagram a structured extension of the website rather than a parallel presence.

---

## 6. Current website features — qualitative view

This section describes the website first as a user would experience it.

## 6.1 Home page
The homepage works as a **brand gateway**:
- strong slogan,
- concise mission framing,
- four navigation cards,
- immediate visual identity through starfield and logo.

It is simple and effective, though still early-stage in content density.

## 6.2 About page
The About page explains the project as a team of three students trying to make science interactive and accessible.

Qualitatively, this adds authenticity and warmth. It makes the brand feel human, not anonymous.

## 6.3 Simulations page
The simulations overview is currently concise and mostly acts as a launchpad to the flagship simulation.

It establishes the direction clearly, but right now the ecosystem still feels narrow because the public simulation count is small.

## 6.4 Double pendulum simulation
This is currently the most mature and differentiated part of the site.

Qualitatively, it feels like the real proof of concept behind STEMfy. It demonstrates:
- educational ambition,
- interaction quality,
- design seriousness,
- technical capability,
- future potential for a whole library of simulations.

## 6.5 Challenges page
The challenges page introduces the idea of participation and Instagram-based sharing. That is a good bridge between social media and product usage.

Right now, however, challenges are more **conceptually present** than platform-native. They do not yet appear connected to a deeper submission, scoring, or leaderboard system.

## 6.6 News page
The news page combines:
- STEM announcements,
- static competition guidance,
- placeholder newsletter messaging,
- a future-facing announcement structure.

This is useful for mission alignment, especially for Greek students, but currently reads as more informational than product-integrated.

## 6.7 Posts page
The posts area is important because it connects the website to Instagram-style publishing and educational resources.

Qualitatively, this is the beginning of a content hub, but it still feels early because:
- there is very little stored content,
- resources are empty,
- the publishing taxonomy is still light.

## 6.8 Contact and footer/social presence
The website consistently routes users toward Instagram and email, which reinforces that the brand is community-facing and social-native.

---

## 7. Current website features — technical view

## 7.1 Frontend architecture
The frontend is currently built with:
- plain HTML pages,
- shared CSS,
- vanilla JavaScript,
- page-specific inline style blocks where needed.

### Strengths
- low complexity,
- easy hosting,
- easy to inspect and edit,
- good performance potential,
- no heavyweight framework lock-in.

### Weaknesses
- repeated markup across pages,
- scaling difficulty as features grow,
- harder long-term maintenance for nav/footer/settings reuse,
- limited component abstraction,
- risk of page drift and inconsistency.

## 7.2 Content and data flow
The dynamic content model currently uses:
- local PHP API endpoints,
- JSON data files,
- uploaded media files,
- WordPress fallback support through `js/cms-api.js`.

This is a pragmatic hybrid setup.

### Strengths
- supports lightweight publishing,
- allows local ownership of content,
- includes fallback behavior,
- avoids forcing a full CMS dependency.

### Weaknesses
- dual-source logic increases complexity,
- content modeling is still fairly thin,
- not yet ideal for user-generated content or competition systems,
- JSON-file storage will become limiting for more relational features.

## 7.3 Admin system
The PHP admin area supports:
- login,
- CRUD for posts,
- CRUD for resources,
- CRUD for news,
- uploads,
- sync-to-GitHub workflow.

This is a very useful operational foundation for a small team.

### Current maturity
It is best described as a **content back office for maintainers**, not yet as a platform administration layer for a community product.

## 7.4 Internationalization
The site has English/Greek string handling through a central `js/i18n.js` system.

This is strategically important because bilingual support can become a major differentiator if the audience includes both local Greek learners and a wider international audience.

## 7.5 Simulation stack
The double pendulum simulation uses vanilla JS and canvas-based rendering with a substantial custom implementation.

Key technical ideas include:
- RK4-based numerical integration,
- adjustable parameters,
- trail rendering,
- chaos-map generation,
- export/download features,
- mobile performance adaptations,
- tutorial/onboarding logic.

This is one of the strongest technical assets in the codebase.

## 7.6 Current structural limitations
The current setup is not yet ideal for the future vision because it does not natively provide:
- user accounts,
- saved progress,
- leaderboards backed by durable relational data,
- moderated public submissions,
- partner organization workflows,
- reusable article/content schemas,
- AI-assisted content generation pipelines,
- analytics-informed community loops.

---

## 8. Current structure of the website

## 8.1 Public-site structure
Current public pages include:
- home,
- about,
- contact,
- simulations,
- simulation detail (double pendulum),
- challenges,
- news,
- posts/resources,
- 404.

## 8.2 Content-domain structure
The site conceptually already spans four domains:

1. **interactive simulations**,
2. **educational content / posts**,
3. **competitions / opportunities**,
4. **community engagement**.

That is the right direction. The issue is that these domains are not yet fully connected into one product system.

## 8.3 Community/product direction latent in the current codebase
The repository already hints at the future through:
- challenge framing,
- competition information,
- upload/admin workflows,
- simulation concepts in `descriptions/coming-soon.md`,
- resources and announcements content types,
- Instagram-linked participation patterns.

This means the future vision is not disconnected from the current site; it is already emerging.

---

## 9. How the technical setup is now

A concise summary of the current stack:

### Presentation layer
- static HTML pages,
- shared CSS plus simulation-specific CSS,
- JS-driven interactivity and localization.

### Dynamic data layer
- PHP endpoints under `admin/`,
- JSON files for stored content,
- uploaded files stored in the repository/server tree,
- optional WordPress fallback.

### Operations layer
- admin login and CRUD,
- file upload handling,
- GitHub sync tooling.

### Simulation layer
- hand-built JS simulation engine and rendering pipeline.

### Hosting model
The repo suggests a simple deployable website structure suited to static hosting with PHP-enabled deployment for full admin/API capability.

---

## 10. How the technical setup could evolve instead

There are two realistic future paths.

## 10.1 Path A — Evolutionary upgrade (lower risk)

Keep the current stack philosophy, but strengthen it.

### Suggested direction
- retain a mostly server-rendered or static public site,
- keep PHP for admin/backend if preferred,
- move from flat JSON storage toward a real database,
- introduce a formal content model,
- add authenticated user submissions,
- add moderation workflows,
- add leaderboard tables and challenge result storage,
- formalize automation scripts for social-media generation.

### Best if
- you want to move gradually,
- you want low operational overhead,
- you want to preserve simplicity,
- the team is comfortable with HTML/CSS/JS/PHP.

## 10.2 Path B — Platform redesign (higher leverage)

Move to a more componentized product stack.

### Suggested direction
- frontend: Astro / Next.js / Nuxt (any component-based system with strong content capabilities),
- backend: Supabase / PostgreSQL / Laravel / Node backend,
- auth: email/social login,
- CMS/content: structured content collections or headless CMS,
- storage: cloud object storage for uploads,
- jobs/automation: queued workers for AI-generated social assets and scheduled publishing.

### Best if
- you want many content types,
- you want user accounts and submissions,
- you want scalable competitions/community features,
- you want richer analytics and automation,
- you want reusable components and design-system discipline.

## 10.3 Recommended approach

For STEMfy, the best route is likely:

### Phase 1
Keep the current site, but reorganize the information architecture and data model.

### Phase 2
Introduce a database-backed backend for:
- users,
- submissions,
- leaderboards,
- competitions,
- partnerships,
- resources,
- article metadata,
- moderation.

### Phase 3
Move the frontend to a componentized system if the content/community surface becomes large enough.

This staged approach reduces risk while preserving momentum.

---

## 11. Proposed future product structure

To support the vision of a learning community, the website should evolve into something like this:

## 11.1 Main product areas

### A. Learn
A structured library of:
- articles,
- explainers,
- concept cards,
- beginner guides,
- downloadable PDFs,
- topic paths.

### B. Explore
A home for:
- simulations,
- visual experiments,
- parameter playgrounds,
- guided explorations,
- “what happens if…” interactions.

### C. Compete
A dedicated system for:
- challenges,
- submission deadlines,
- scoreboards,
- seasonal competitions,
- badges,
- leaderboard pages.

### D. Community
A place for:
- featured student projects,
- member profiles,
- public submissions,
- partner organizations,
- team challenges,
- comments or reactions if moderated appropriately.

### E. Opportunities
A more structured version of the current news/competition area:
- olympiads,
- camps,
- summer schools,
- calls for applications,
- events,
- deadlines.

### F. Media
A bridge between the website and social channels:
- Instagram post archive,
- reel/article pairing,
- “from social to deep dive” routing,
- downloadable media kits,
- campaign landing pages.

---

## 12. Proposed content model

A stronger future setup would separate content types clearly.

Recommended core entities:

- **Users**
- **Simulations**
- **Simulation Versions**
- **Articles**
- **Resources**
- **Competitions**
- **Challenges**
- **Submissions**
- **Leaderboard Entries**
- **Partners**
- **Social Posts**
- **Campaigns**
- **Announcements / Opportunities**

This would make it much easier to build navigation, filters, recommendations, and automation.

---

## 13. Community posting and partnerships

Your goal of allowing others to post simulations or resources is strong, but it needs structure.

## 13.1 Recommended submission model
Do **not** start with fully open publishing.

Start with:
- authenticated submission,
- submission form templates,
- moderation review,
- draft / approved / published states,
- contributor attribution,
- partner organization tagging,
- licensing fields,
- safety/content standards.

## 13.2 Suggested submission types
- submit a simulation,
- submit an article/resource,
- submit a challenge result,
- submit a collaboration/partnership proposal,
- submit a competition/opportunity listing.

## 13.3 Why moderation matters
Because the platform is educational and community-facing, moderation is essential for:
- trust,
- quality control,
- legal safety,
- accurate STEM communication,
- protecting the brand.

---

## 14. Agentic AI automation opportunities

You specifically mentioned AI automation for feature-description posts. That is a very good fit.

## 14.1 Recommended automation areas

### A. Social post generation
Input:
- simulation metadata,
- article summary,
- challenge deadline,
- competition announcement.

Output:
- Instagram carousel copy,
- reel script,
- short caption variants,
- hashtag packs,
- CTA suggestions,
- bilingual versions.

### B. Asset templating
Input:
- title,
- category,
- accent color,
- icon,
- hero visual.

Output:
- branded post cover,
- story version,
- square post version,
- reel cover frame.

### C. Content repurposing
Convert:
- article -> carousel,
- simulation -> tutorial post,
- challenge -> launch post + reminder post + winner post,
- news item -> short explainer graphic.

### D. Editorial assistance
- draft summaries,
- simplify language for younger learners,
- generate bilingual first drafts,
- produce alt text and accessibility descriptions.

## 14.2 Important guardrail
For science content, AI should support drafting and formatting, but human review should remain mandatory for factual and pedagogical quality.

---

## 15. Areas where the visual identity could evolve

This section focuses on where to change the identity without losing what already works.

## 15.1 Logo system
### What could change
- create vector master files,
- define wordmark rules,
- define spacing and safe area,
- create icon-only and social-avatar variants,
- create animated logo behavior for intros/loaders.

### Example improvements
- a more refined star/orbit/particle motif,
- a cleaner wordmark lockup for headers and decks,
- a premium monochrome version for mature pages and partner use.

## 15.2 Typography system
### What could change
- keep Outfit for body and main UI,
- add a controlled mono/pixel accent font,
- define type scales for hero, section, card, label, stat, and control levels.

### Example improvements
- pixel/mono labels for simulation axes,
- “mission control” style chips for challenge stats,
- tighter display hierarchy for landing pages.

## 15.3 Color and contrast system
### What could change
- formalize primary / secondary / semantic palettes,
- improve contrast consistency,
- define subject-specific accent extensions.

### Example improvements
- physics = violet,
- math = cyan-violet,
- engineering = amber-purple,
- AI/tech = cyan-magenta,
- competitions = trophy gold on cosmic dark.

## 15.4 Motion system
### What could change
- turn the starfield into a formal motion language,
- define hover behavior, loading behavior, success states, and celebration states.

### Example improvements
- subtle star drift on landing pages,
- pulse/glow on CTA hover,
- score-submission confirmation burst,
- animated constellation links between related topics.

## 15.5 Iconography
### What could change
- unify stroke width, corner radius, fill logic, and color usage.

### Example improvements
- one icon system for UI,
- one illustration system for social covers,
- one badge system for competitions and levels.

## 15.6 Imagery and social templates
### What could change
- create consistent branded templates for carousels, reels, stories, and post covers.

### Example improvements
- simulation cover cards,
- “challenge of the week” layouts,
- competition alert cards,
- featured contributor cards,
- article summary covers.

---

## 16. Areas where UI/UX could change

## 16.1 Navigation and information architecture
### Current issue
Pages are understandable individually, but the platform direction is broader than the navigation currently communicates.

### Recommended change
Restructure top-level navigation around the product pillars.

### Example future nav
- Learn
- Simulations
- Challenges
- Competitions
- Community
- Resources
- About

## 16.2 Homepage storytelling
### Current issue
The homepage is clean, but it still behaves like a small launch page rather than the home of an ecosystem.

### Recommended change
Expand the homepage into a layered landing experience.

### Example additions
- featured simulation,
- current competition banner,
- recent article/resource,
- leaderboard preview,
- Instagram/social strip,
- featured student contribution,
- partner logos.

## 16.3 Simulation discoverability
### Current issue
The simulation area is promising but currently too shallow.

### Recommended change
Turn simulations into a browsable library.

### Example features
- filter by topic,
- difficulty,
- subject tags,
- “best for beginners,”
- “most visual,”
- “competition-linked,”
- “teacher favorite.”

## 16.4 Challenge UX
### Current issue
Challenges are presented, but not yet systematized.

### Recommended change
Create a proper challenge product flow.

### Example features
- challenge landing pages,
- rules,
- deadlines,
- submission form,
- example entries,
- scoring criteria,
- leaderboard,
- winners gallery.

## 16.5 Resource and article UX
### Current issue
Posts/resources currently feel like a basic feed and file list direction.

### Recommended change
Build structured reading and learning experiences.

### Example features
- topic pages,
- related resources,
- read/watch/try pathways,
- saved collections,
- beginner/intermediate/advanced labels.

## 16.6 Community UX
### Current issue
The community ambition exists conceptually, but not yet in platform behavior.

### Recommended change
Add safe, curated participation layers.

### Example features
- contributor profiles,
- featured submissions,
- partnership showcases,
- challenge participation history,
- reputation or badge system.

## 16.7 Visual maturity
### Current issue
The current UI is attractive, but some sections still read as “early build” due to sparse content and repeated layout patterns.

### Recommended change
Introduce stronger systems for rhythm and hierarchy.

### Example improvements
- more deliberate spacing scales,
- clearer section introductions,
- richer empty states,
- more premium cards/tables,
- stronger CTA hierarchy,
- more editorial layout variety.

---

## 17. Recommended next steps

## 17.1 Immediate
1. Freeze the current visual identity into a simple brand system document.
2. Audit all existing assets and create a master asset library.
3. Decide on the long-term product IA (Learn / Explore / Compete / Community / Opportunities / Media).
4. Define the minimum viable data model for competitions, submissions, and resources.

## 17.2 Short term
1. Expand the simulations and posts/resources sections.
2. Add a formal leaderboard-ready challenge structure.
3. Create social-media templates and automation prompts/workflows.
4. Refine the homepage into a platform front door.

## 17.3 Medium term
1. Move from JSON-only storage toward database-backed models.
2. Add user accounts and moderation workflows.
3. Build contributor and partner submission flows.
4. Introduce analytics and content-performance feedback loops.

---

## 18. Final conclusion

STEMfy already has the beginnings of a **real brand**, not just a school project website.

Its strongest assets are:
- a memorable cosmic STEM atmosphere,
- a strong purple-led palette,
- a promising logo/icon universe,
- a distinctive interactive simulation approach,
- bilingual positioning,
- a mission that naturally supports both content and community.

The most important shift now is to move from:

- **a stylish exploratory website**

into:

- **a structured science-learning platform and community ecosystem**.

The good news is that the existing repository already contains the seeds of that future. The next phase should focus on systematizing the brand, content model, product architecture, and contribution workflows so that the visual identity and the learning mission grow together.
