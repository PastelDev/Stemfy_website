# STEMfy.gr Website Consistency & Implementation Plan

## Overview

This plan ensures all HTML pages have consistent settings, styling, language support, and implements the placeholder pages with real content. It also removes dead code from JavaScript files.

---

## Current State Analysis

### Existing Pages

| Page | Status | Language | Has Nav | Has Settings | Has Footer | Has i18n |
|------|--------|----------|---------|--------------|------------|----------|
| index.html | Complete | `lang="en"` | Yes | Yes | Yes | Yes |
| about.html | Complete | `lang="el"` (hardcoded) | Partial (logo only) | No | No | No |
| simulations.html | Partial | `lang="el"` (hardcoded) | No | No | No | No |
| double-pendulum.html | Complete | `lang="el"` (hardcoded) | Custom sim nav | No | No | No |
| 404.html | Complete | `lang="el"` (hardcoded) | No | No | No | No |
| challenges.html | Placeholder | `lang="el"` (hardcoded) | No | No | No | No |
| contact.html | Placeholder | `lang="el"` (hardcoded) | No | No | No | No |
| news.html | Placeholder | `lang="el"` (hardcoded) | No | No | No | No |
| philosophy.html | Placeholder | `lang="el"` (hardcoded) | No | No | No | No |

### Issues Identified

1. **Language inconsistency**: Only `index.html` supports dynamic language switching
2. **Navigation inconsistency**: Only `index.html` has full navigation with settings button
3. **No settings on other pages**: Users can't change language/theme except on homepage
4. **No footer on other pages**: Missing copyright and social links
5. **Dead code in JS files**: Unused functions in `common.js` and `double-pendulum.js`
6. **Placeholder pages**: 4 pages need real content
7. **Missing posts.html**: Referenced in index.html but doesn't exist
8. **philosophy.html obsolete**: Replaced by posts.html

---

## Files to Modify/Create/Delete

### Create
- `posts.html` - New page for Instagram posts + educational PDFs

### Delete
- `philosophy.html` - Replaced by posts.html

### Modify

| File | Changes |
|------|---------|
| `index.html` | Fix Posts link: `href="#"` → `href="posts.html"` |
| `about.html` | Add: full nav, settings modal, footer, i18n scripts, change to `lang="en"` |
| `simulations.html` | Add: full nav, settings modal, footer, i18n scripts, change to `lang="en"` |
| `404.html` | Add: full nav, settings modal, footer, i18n scripts, change to `lang="en"` |
| `challenges.html` | Full rewrite with content + nav/settings/footer/i18n |
| `contact.html` | Full rewrite with content + nav/settings/footer/i18n |
| `news.html` | Full rewrite with content + nav/settings/footer/i18n |
| `js/i18n.js` | Add translations for all pages |
| `js/common.js` | Remove dead code (3 functions) |
| `js/double-pendulum.js` | Remove dead code (1 function) |

---

## Phase 1: Fix index.html

**File:** `index.html`

**Change:** Line 81
```html
<!-- FROM -->
<a href="#" class="nav-card">

<!-- TO -->
<a href="posts.html" class="nav-card">
```

---

## Phase 2: Delete philosophy.html

**Action:** Delete `philosophy.html` (replaced by posts.html)

---

## Phase 3: Expand i18n.js Translations

**File:** `js/i18n.js`

Add the following translation keys to both `en` and `el` objects:

```javascript
// ===== ENGLISH (en) =====

// Common
back_home: 'Back to Home',
coming_soon: 'Coming Soon',
available: 'Available',

// About page
about_title: 'About Us',
about_who_we_are: 'Who We Are',
about_who_text: 'We are three students with a shared passion: to make science accessible, interactive, and fun. We believe that the best learning happens through exploration and experimentation.',
about_stemfy_title: 'About STEMfy.gr',
about_stemfy_text: 'STEMfy.gr is our channel for all things STEM - Science, Technology, Engineering, Mathematics. We create content that explains complex ideas simply, and we build interactive simulations so you can experiment yourself.',
about_motto: 'Our motto:',
about_motto_text: 'Make STEM Addictive!',
about_contact_title: 'Contact',

// Simulations page
simulations_title: 'Simulations',
simulations_subtitle: 'Interactive visualizations of physics & mathematics for exploration and learning',
sim_pendulum_title: 'Double Pendulum',
sim_pendulum_desc: 'Explore chaos in a simple system. See how small changes lead to completely different outcomes.',
sim_bridge_title: 'Bridge Builder',
sim_bridge_desc: 'Design and test bridges. Learn about structural engineering and material stress.',
sim_mandelbrot_title: 'Mandelbrot Set',
sim_mandelbrot_desc: 'Dive into infinite complexity. Explore the most famous fractal in mathematics.',

// Challenges page
challenges_title: 'Challenges',
challenges_subtitle: 'Test your skills with our simulation challenges',
challenges_intro: 'Complete challenges using our simulations and share your results on Instagram!',
challenge_pendulum_trajectory: 'Pendulum Trajectory',
challenge_pendulum_trajectory_desc: 'Find the most beautiful double pendulum trajectory pattern',
challenge_chaos_map: 'Chaos Map Explorer',
challenge_chaos_map_desc: 'Discover interesting shapes in the chaos map',
challenge_mandelbrot: 'Mandelbrot Zoom',
challenge_mandelbrot_desc: 'Find the most stunning Mandelbrot zoom location',
challenge_bridge: 'Bridge Master',
challenge_bridge_desc: 'Build the most durable bridge with limited materials',
submit_instagram: 'Submit on Instagram',
try_simulation: 'Try Simulation',

// Contact page
contact_title: 'Contact',
contact_subtitle: 'Get in touch with us',
contact_instagram: 'Instagram',
contact_email: 'Email',

// News page
news_title: 'News',
news_subtitle: 'Science news and competition updates',
newsletter_title: 'Newsletter',
newsletter_desc: 'Subscribe to receive the latest STEM news and updates',
newsletter_coming: 'Newsletter signup coming soon!',
competitions_title: 'Competitions for Greek Students',
competitions_intro: 'Information about science and math olympiads available to Greek students',
comp_math: 'Mathematics',
comp_physics: 'Physics',
comp_informatics: 'Informatics',
comp_science: 'Science & Research',
comp_astronomy: 'Astronomy',

// Posts page
posts_title: 'Posts',
posts_subtitle: 'Thoughts, insights & discoveries',
posts_instagram_title: 'From Instagram',
posts_instagram_desc: 'Our latest posts from @stemfy.gr',
posts_resources_title: 'Educational Resources',
posts_resources_desc: 'PDFs and visual guides explaining STEM concepts',
posts_no_content: 'Content coming soon!',

// 404 page
error_404: '404',
error_title: 'Page Not Found',
error_message: 'Sorry, the page you are looking for does not exist.',


// ===== GREEK (el) =====

// Common
back_home: 'Πίσω στην Αρχική',
coming_soon: 'Έρχεται Σύντομα',
available: 'Διαθέσιμο',

// About page
about_title: 'Σχετικά με εμάς',
about_who_we_are: 'Ποιοι Είμαστε',
about_who_text: 'Είμαστε τρεις μαθητές με κοινό πάθος: να κάνουμε την επιστήμη προσβάσιμη, διαδραστική και διασκεδαστική. Πιστεύουμε ότι η καλύτερη μάθηση συμβαίνει μέσα από την εξερεύνηση και τον πειραματισμό.',
about_stemfy_title: 'Σχετικά με το STEMfy.gr',
about_stemfy_text: 'Το STEMfy.gr είναι το κανάλι μας για όλα τα θέματα STEM - Επιστήμη, Τεχνολογία, Μηχανική, Μαθηματικά. Δημιουργούμε περιεχόμενο που εξηγεί πολύπλοκες ιδέες με απλό τρόπο, και χτίζουμε διαδραστικές προσομοιώσεις ώστε να μπορείς να πειραματιστείς μόνος σου.',
about_motto: 'Το σύνθημά μας:',
about_motto_text: 'Κάνε το STEM Εθιστικό!',
about_contact_title: 'Επικοινωνία',

// Simulations page
simulations_title: 'Προσομοιώσεις',
simulations_subtitle: 'Διαδραστικές απεικονίσεις φυσικής & μαθηματικών για εξερεύνηση και μάθηση',
sim_pendulum_title: 'Διπλό Εκκρεμές',
sim_pendulum_desc: 'Εξερεύνησε το χάος σε ένα απλό σύστημα. Δες πώς μικρές αλλαγές οδηγούν σε τελείως διαφορετικά αποτελέσματα.',
sim_bridge_title: 'Κατασκευαστής Γεφυρών',
sim_bridge_desc: 'Σχεδίασε και δοκίμασε γέφυρες. Μάθε για τη δομική μηχανική και την καταπόνηση υλικών.',
sim_mandelbrot_title: 'Σύνολο Mandelbrot',
sim_mandelbrot_desc: 'Βουτιά στην άπειρη πολυπλοκότητα. Εξερεύνησε το πιο διάσημο fractal στα μαθηματικά.',

// Challenges page
challenges_title: 'Προκλήσεις',
challenges_subtitle: 'Δοκίμασε τις ικανότητές σου με τις προκλήσεις μας',
challenges_intro: 'Ολοκλήρωσε προκλήσεις χρησιμοποιώντας τις προσομοιώσεις μας και μοιράσου τα αποτελέσματά σου στο Instagram!',
challenge_pendulum_trajectory: 'Τροχιά Εκκρεμούς',
challenge_pendulum_trajectory_desc: 'Βρες το πιο όμορφο μοτίβο τροχιάς διπλού εκκρεμούς',
challenge_chaos_map: 'Εξερευνητής Χάρτη Χάους',
challenge_chaos_map_desc: 'Ανακάλυψε ενδιαφέροντα σχήματα στον χάρτη χάους',
challenge_mandelbrot: 'Mandelbrot Zoom',
challenge_mandelbrot_desc: 'Βρες την πιο εντυπωσιακή τοποθεσία zoom στο Mandelbrot',
challenge_bridge: 'Μάστορας Γεφυρών',
challenge_bridge_desc: 'Χτίσε την πιο ανθεκτική γέφυρα με περιορισμένα υλικά',
submit_instagram: 'Υποβολή στο Instagram',
try_simulation: 'Δοκίμασε την Προσομοίωση',

// Contact page
contact_title: 'Επικοινωνία',
contact_subtitle: 'Επικοινώνησε μαζί μας',
contact_instagram: 'Instagram',
contact_email: 'Email',

// News page
news_title: 'Νέα',
news_subtitle: 'Επιστημονικά νέα και ενημερώσεις διαγωνισμών',
newsletter_title: 'Newsletter',
newsletter_desc: 'Εγγραφείτε για να λαμβάνετε τα τελευταία νέα STEM',
newsletter_coming: 'Η εγγραφή στο newsletter έρχεται σύντομα!',
competitions_title: 'Διαγωνισμοί για Έλληνες Μαθητές',
competitions_intro: 'Πληροφορίες για επιστημονικές και μαθηματικές ολυμπιάδες διαθέσιμες σε Έλληνες μαθητές',
comp_math: 'Μαθηματικά',
comp_physics: 'Φυσική',
comp_informatics: 'Πληροφορική',
comp_science: 'Επιστήμη & Έρευνα',
comp_astronomy: 'Αστρονομία',

// Posts page
posts_title: 'Δημοσιεύσεις',
posts_subtitle: 'Σκέψεις, ιδέες & ανακαλύψεις',
posts_instagram_title: 'Από το Instagram',
posts_instagram_desc: 'Οι τελευταίες δημοσιεύσεις μας από το @stemfy.gr',
posts_resources_title: 'Εκπαιδευτικοί Πόροι',
posts_resources_desc: 'PDFs και οπτικοί οδηγοί που εξηγούν έννοιες STEM',
posts_no_content: 'Περιεχόμενο έρχεται σύντομα!',

// 404 page
error_404: '404',
error_title: 'Σελίδα Δεν Βρέθηκε',
error_message: 'Συγγνώμη, η σελίδα που ψάχνεις δεν υπάρχει.',
```

### Update updatePageContent() Method

Add page detection logic to `updatePageContent()` to handle each page type:

```javascript
updatePageContent() {
  const path = window.location.pathname;

  // Always update common elements if they exist
  this.updateNavigation();
  this.updateFooter();
  this.updateSettingsModal();

  // Page-specific updates
  if (path.includes('about')) {
    this.updateAboutPage();
  } else if (path.includes('simulations')) {
    this.updateSimulationsPage();
  } else if (path.includes('challenges')) {
    this.updateChallengesPage();
  } else if (path.includes('contact')) {
    this.updateContactPage();
  } else if (path.includes('news')) {
    this.updateNewsPage();
  } else if (path.includes('posts')) {
    this.updatePostsPage();
  } else if (path.includes('404')) {
    this.update404Page();
  } else {
    // Homepage
    this.updateHomePage();
  }
}
```

---

## Phase 4: Standardize Page Structure

### Common Elements to Add to All Pages

#### 1. Navigation Bar (copy from index.html lines 38-54)
```html
<nav>
  <a href="index.html" class="logo">
    <div class="logo-icon">
      <img src="assets/logo.png" alt="STEMfy.gr logo">
    </div>
    <div class="logo-text">STEM<span>fy.gr</span></div>
  </a>
  <div class="nav-right">
    <ul class="nav-links">
      <li><a href="about.html">About</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <button class="settings-btn" id="settings-btn" aria-label="Settings" title="Settings">
      <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l1.72-1.35c.15-.12.19-.34.1-.51l-1.63-2.83c-.12-.22-.37-.29-.59-.22l-2.03.81c-.42-.32-.9-.6-1.42-.82l-.31-2.15c-.04-.24-.24-.41-.48-.41h-3.26c-.24 0-.43.17-.47.41l-.31 2.15c-.52.23-1 .5-1.42.82l-2.03-.81c-.22-.09-.47 0-.59.22L2.74 8.87c-.12.21-.08.44.1.51l1.72 1.35c-.05.3-.07.62-.07.94s.02.64.07.94l-1.72 1.35c-.15.12-.19.34-.1.51l1.63 2.83c.12.22.37.29.59.22l2.03-.81c.42.32.9.6 1.42.82l.31 2.15c.05.24.24.41.48.41h3.26c.24 0 .43-.17.47-.41l.31-2.15c.52-.23 1-.5 1.42-.82l2.03.81c.22.09.47 0 .59-.22l1.63-2.83c.12-.22.07-.44-.1-.51l-1.72-1.35zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
    </button>
  </div>
</nav>
```

#### 2. Settings Modal (copy from index.html lines 99-123)
```html
<!-- Settings Modal -->
<div class="settings-modal" id="settings-modal">
  <div class="settings-modal-content">
    <div class="settings-header">
      <h2 id="settings-title">Settings</h2>
      <button class="settings-close" id="settings-close" aria-label="Close">&times;</button>
    </div>
    <div class="settings-body">
      <div class="settings-group">
        <label for="language-select" id="language-label">Language</label>
        <select id="language-select">
          <option value="en">English</option>
          <option value="el">Ελληνικά</option>
        </select>
      </div>
      <div class="settings-group">
        <label for="theme-select" id="theme-label">Theme</label>
        <select id="theme-select">
          <option value="purple">Purple</option>
          <option value="blue">Blue</option>
        </select>
      </div>
    </div>
  </div>
</div>
```

#### 3. Footer (copy from index.html lines 89-96)
```html
<footer>
  <p>&copy; 2025 STEMfy.gr - Made with ❤️ by three curious students</p>
  <div class="social-links">
    <a href="https://instagram.com/stemfy.gr" target="_blank" rel="noopener" title="Instagram">
      <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </a>
  </div>
</footer>
```

#### 4. Scripts (add before </body>)
```html
<script src="js/starfield.js"></script>
<script src="js/i18n.js"></script>
<script src="js/ui.js"></script>
```

#### 5. Change HTML lang attribute
```html
<!-- FROM -->
<html lang="el">

<!-- TO -->
<html lang="en">
```

---

## Phase 5: Implement Content Pages

### 5.1 challenges.html

**Content Structure:**
- Header with title "Challenges"
- Introduction explaining how to participate
- Grid of 4 challenge cards:
  1. **Pendulum Trajectory** - Active (links to double-pendulum.html)
  2. **Chaos Map Explorer** - Active (links to double-pendulum.html)
  3. **Mandelbrot Zoom** - Coming soon
  4. **Bridge Master** - Coming soon
- Each card has:
  - Icon
  - Title
  - Description
  - Status badge (Active/Coming Soon)
  - Button: "Try Simulation" or "Submit on Instagram"

### 5.2 contact.html

**Content Structure:**
- Header with title "Contact"
- Centered card with two contact methods:
  1. **Instagram**: @stemfy.gr with Instagram icon, links to https://instagram.com/stemfy.gr
  2. **Email**: team@stemfy.gr with email icon, mailto link

### 5.3 news.html

**Content Structure:**
- Header with title "News"
- **Newsletter Section:**
  - Title: "Newsletter"
  - Description about subscribing
  - "Coming soon" placeholder
- **Competitions Section:**
  - Title: "Competitions for Greek Students"
  - Grid of competition categories:
    - **Mathematics**: IMO, BMO, EGMO
    - **Physics**: IPhO, BPhO
    - **Informatics**: IOAI
    - **Science & Research**: IYPT, IYNT
    - **Astronomy**: IOA, etc.
  - Each shows: Name, brief description, link to official site

### 5.4 posts.html

**Content Structure:**
- Header with title "Posts"
- **Instagram Section:**
  - Title: "From Instagram"
  - Placeholder for manual Instagram embeds (3-6 post placeholders)
  - Note: Full API integration is complex; start with manual embeds
- **Educational Resources Section:**
  - Title: "Educational Resources"
  - Grid for PDF uploads (placeholder cards for now)
  - "More content coming soon" message

---

## Phase 6: Remove Dead Code

### 6.1 js/common.js

**Remove these functions:**

1. **`initStarfield()`** (lines 10-97)
   - Reason: Duplicate of starfield.js, never called

2. **`initGalaxyLogo()`** (lines 103-203)
   - Reason: No `#galaxy-logo` canvas exists in any HTML file

3. **`hslToRgb()`** (lines 275-297)
   - Reason: Not referenced anywhere in the codebase

**Keep these functions (used by double-pendulum.js):**
- `formatNumber()`
- `clamp()`
- `lerp()`
- `mapRange()`
- `degToRad()`
- `radToDeg()`
- `getChaosColor()`
- `debounce()`
- `throttle()`

### 6.2 js/double-pendulum.js

**Remove:**
- **`computeChaosMapWithWorker()`** (lines 672-676)
  - Reason: Stub function that just calls `computeChaosMapDirect()`, Web Worker never implemented

---

## Implementation Order

1. Fix `index.html` Posts link
2. Delete `philosophy.html`
3. Expand `js/i18n.js` with all translations
4. Standardize `about.html`
5. Standardize `simulations.html`
6. Standardize `404.html`
7. Implement `challenges.html`
8. Implement `contact.html`
9. Implement `news.html`
10. Create `posts.html`
11. Remove dead code from `js/common.js`
12. Remove dead code from `js/double-pendulum.js`

---

## Verification Checklist

After implementation, verify:

- [ ] All pages have `lang="en"` attribute
- [ ] All pages have full navigation bar with settings button
- [ ] All pages have settings modal
- [ ] All pages have footer
- [ ] All pages load i18n.js and ui.js
- [ ] Language switching works on all pages
- [ ] Language persists when navigating between pages
- [ ] Theme switching works on all pages
- [ ] Theme persists when navigating between pages
- [ ] All navigation links work correctly
- [ ] Posts link goes to posts.html
- [ ] philosophy.html is deleted
- [ ] Double pendulum simulation still works after common.js cleanup
- [ ] No console errors on any page
