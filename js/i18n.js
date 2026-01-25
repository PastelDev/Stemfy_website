/* ============================================
   STEMfy.gr - Internationalization & Theme System
   ============================================ */

const I18N = {
  // Language strings
  en: {
    // Navigation
    about: 'About',
    contact: 'Contact',

    // Hero section
    badge_text: 'Now available \u2014 Double pendulum simulation',
    hero_title: 'Make STEM addictive',
    hero_subtitle: 'Three minds. One mission. Interactive simulations, scientific news and challenges that make learning impossible to ignore.',

    // Navigation cards
    simulations: 'Simulations',
    simulations_desc: 'Interactive visualizations of physics & mathematics',
    news: 'News',
    news_desc: 'Latest scientific news, simple and understandable',
    challenges: 'Challenges',
    challenges_desc: 'Test your knowledge & compete',
    posts: 'Posts',
    posts_desc: 'Thoughts, insights & discoveries',

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

    // Double pendulum page
    pendulum_title: 'Double Pendulum',
    tutorial: 'Tutorial',
    open_controls: 'Open controls',
    open_chaos: 'Open chaos map',
    controls_title: 'Controls',
    toggle_chaos: 'Toggle chaos map',
    reset_label: 'Reset',
    play_label: 'Play',
    pause_label: 'Pause',
    view_mobile_label: 'Switch to mobile view',
    view_desktop_label: 'Switch to desktop view',
    speed_label: 'Speed',
    section_masses_title: 'Masses (kg)',
    section_lengths_title: 'Lengths (m)',
    section_angles_title: 'Initial Angles (\u00B0)',
    section_velocities_title: 'Initial Velocities (rad/s)',
    section_gravity_title: 'Gravity',
    section_damping_title: 'Damping',
    section_trail_title: 'Trail',
    label_m1: 'm\u2081',
    label_m2: 'm\u2082',
    label_L1: 'L\u2081',
    label_L2: 'L\u2082',
    label_theta1: '\u03B8\u2081',
    label_theta2: '\u03B8\u2082',
    label_omega1: '\u03C9\u2081',
    label_omega2: '\u03C9\u2082',
    label_g: 'g (m/s\u00B2)',
    damping_enabled: 'Enable',
    damping_coefficient: 'Coefficient',
    trail_enabled: 'Show trail',
    trail_infinite: 'Infinite trail',
    trail_duration: 'Duration',
    chaos_title: 'Chaos Map',
    chaos_subtitle: 'Click to choose initial conditions',
    chaos_axis_x: 'Axis X',
    chaos_axis_y: 'Axis Y',
    axis_theta1: '\u03B8\u2081 (angle 1)',
    axis_theta2: '\u03B8\u2082 (angle 2)',
    axis_omega1: '\u03C9\u2081 (angular velocity 1)',
    axis_omega2: '\u03C9\u2082 (angular velocity 2)',
    chaos_legend_stable: 'Stable',
    chaos_legend_chaotic: 'Chaotic',
    recompute_chaos: 'Recompute',
    chaos_grid_label: 'Show grid',
    chaos_info_title: 'What does it mean?',
    chaos_info_text: 'The color shows how chaotic the motion is for each set of initial conditions. In chaotic regions, a tiny change at the start leads to a completely different path.',
    chaos_loading: 'Computing... {percent}%',

    // Tutorial
    tutorial_step_label: 'Step {current} / {total}',
    tutorial_skip: 'Skip',
    tutorial_next: 'Next',
    tutorial_finish: 'Finish',
    tutorial_canvas_title: 'Simulation Canvas',
    tutorial_canvas_text: 'Watch the double pendulum in motion. The first arm hangs from the pivot, and the second hangs from the first.',
    tutorial_play_title: 'Play / Pause',
    tutorial_play_text: 'Start or pause the simulation. You can also press the Space bar.',
    tutorial_reset_title: 'Reset',
    tutorial_reset_text: 'Reset the pendulum to its initial state. You can also press R.',
    tutorial_speed_title: 'Speed',
    tutorial_speed_text: 'Adjust how fast the simulation runs.',
    tutorial_masses_title: 'Masses',
    tutorial_masses_text: 'Change the masses to see how the motion evolves and how the two arms interact.',
    tutorial_lengths_title: 'Lengths',
    tutorial_lengths_text: 'Adjust the lengths to change how far each arm reaches.',
    tutorial_angles_title: 'Initial Angles',
    tutorial_angles_text: 'Set the starting angles. 0\u00B0 is straight down, 90\u00B0 is horizontal.',
    tutorial_velocities_title: 'Initial Velocities',
    tutorial_velocities_text: 'Give the pendulum an initial push by setting angular velocities.',
    tutorial_trail_title: 'Trail',
    tutorial_trail_text: 'Toggle the trail to reveal beautiful patterns of motion.',
    tutorial_chaos_toggle_title: 'Chaos Map',
    tutorial_chaos_toggle_text: 'Open the chaos map to explore initial conditions.',
    tutorial_chaos_panel_title: 'Chaos Map',
    tutorial_chaos_panel_text: 'Each point corresponds to a different set of initial conditions. Click a point to see the resulting motion.',

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
    competitions_title: 'International Competitions',
    competitions_intro: 'Information about science and math olympiads available to Greek students',
    comp_math: 'Mathematics',
    comp_physics: 'Physics',
    comp_informatics: 'Informatics',
    comp_science: 'Science & Research',
    comp_astronomy: 'Astronomy',
    selection_title: 'Panhellenic Competitions',
    selection_intro: 'Inside-Greece competitions and how they lead to international Olympiads.',
    selection_math_title: 'Mathematics',
    selection_math_national: 'Greece: <a href="https://www.hms.gr/diagonismoi/" target="_blank" rel="noopener">Hellenic Mathematical Society rounds</a> (Thales \u2192 Euclid \u2192 Archimedes) lead to the preliminary selection exam for national teams.',
    selection_math_international: 'International: <a href="https://imo-official.org/" target="_blank" rel="noopener">IMO</a>, <a href="https://bmo-olympiad.org/" target="_blank" rel="noopener">BMO (Balkan)</a>, <a href="https://www.egmo.org/" target="_blank" rel="noopener">EGMO</a>.',
    selection_physics_title: 'Physics',
    selection_physics_national: 'Greece: The Panhellenic Physics Competition "Aristotle" (<a href="https://www.eef.gr/" target="_blank" rel="noopener">EEF</a>) is the official selection route; top students enter training and the national team.',
    selection_physics_international: 'International: <a href="https://www.ipho-new.org/" target="_blank" rel="noopener">IPhO</a>, <a href="https://balkanphysicsolympiad.com/" target="_blank" rel="noopener">BPO (Balkan)</a>, <a href="https://eupho.org/" target="_blank" rel="noopener">EuPhO</a>.',
    selection_informatics_title: 'Informatics',
    selection_informatics_national: 'Greece: The <a href="https://www.e-olymp.gr/" target="_blank" rel="noopener">Panhellenic Informatics Competition</a> selects and prepares the national team.',
    selection_informatics_international: 'International: <a href="https://ioinformatics.org/" target="_blank" rel="noopener">IOI</a>, BOI, EJOI, <a href="https://ioai-official.org/" target="_blank" rel="noopener">IOAI</a>.',
    selection_astronomy_title: 'Astronomy',
    selection_astronomy_national: 'Greece: The <a href="https://astronomos.gr/apotelesmata-3is-fasis-ptolemaios-lykeiou-27os-panellinios-diagonismos-astronomias/" target="_blank" rel="noopener">Panhellenic Astronomy &amp; Astrophysics Competition</a> runs multiple phases; the final phase has been used to select IOAA teams.',
    selection_astronomy_international: 'International: <a href="https://ioaastrophysics.org/" target="_blank" rel="noopener">IOAA</a>.',
    selection_research_title: 'Science &amp; Research',
    selection_research_national: 'Greece: The <a href="https://iynt.eef.gr/" target="_blank" rel="noopener">Hellenic Physical Society</a> coordinates Greek participation and team formation for IYPT and IYNT.',
    selection_research_international: 'International: <a href="https://www.iypt.org/" target="_blank" rel="noopener">IYPT</a>, <a href="https://iynt.eef.gr/" target="_blank" rel="noopener">IYNT</a>.',

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

    // Footer
    footer_text: '\u00A9 2025 STEMfy.gr - Made with \u2764 by three curious students',

    // Settings
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    english: 'English',
    greek: 'Greek',
    purple: 'Purple',
    blue: 'Blue',
    custom: 'Custom'
  },

  el: {
    // Navigation
    about: 'Σχετικά',
    contact: 'Επικοινωνία',

    // Hero section
    badge_text: 'Τώρα διαθέσιμη — Προσομοίωση διπλού εκκρεμούς',
    hero_title: 'Κάνε το STEM εθιστικό',
    hero_subtitle: 'Τρία μυαλά. Μία αποστολή. Διαδραστικές προσομοιώσεις, επιστημονικά νέα και προκλήσεις που κάνουν τη μάθηση αδύνατο να αγνοηθεί.',

    // Navigation cards
    simulations: 'Προσομοιώσεις',
    simulations_desc: 'Διαδραστικές απεικονίσεις φυσικής & μαθηματικών',
    news: 'Νέα',
    news_desc: 'Τα τελευταία επιστημονικά νέα, απλά και κατανοητά',
    challenges: 'Προκλήσεις',
    challenges_desc: 'Δοκίμασε τις γνώσεις σου & ανταγωνίσου',
    posts: 'Δημοσιεύσεις',
    posts_desc: 'Σκέψεις, ιδέες & ανακαλύψεις',

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

    // Double pendulum page
    pendulum_title: 'Διπλό Εκκρεμές',
    tutorial: 'Οδηγός',
    open_controls: 'Άνοιγμα χειριστηρίων',
    open_chaos: 'Άνοιγμα χάρτη χάους',
    controls_title: 'Χειριστήρια',
    toggle_chaos: 'Εναλλαγή χάρτη χάους',
    reset_label: 'Επαναφορά',
    play_label: 'Αναπαραγωγή',
    pause_label: 'Παύση',
    view_mobile_label: 'Εναλλαγή σε προβολή κινητού',
    view_desktop_label: 'Εναλλαγή σε προβολή υπολογιστή',
    speed_label: 'Ταχύτητα',
    section_masses_title: 'Μάζες (kg)',
    section_lengths_title: 'Μήκη (m)',
    section_angles_title: 'Αρχικές Γωνίες (°)',
    section_velocities_title: 'Αρχικές Ταχύτητες (rad/s)',
    section_gravity_title: 'Βαρύτητα',
    section_damping_title: 'Απόσβεση',
    section_trail_title: 'Ίχνος',
    label_m1: 'm₁',
    label_m2: 'm₂',
    label_L1: 'L₁',
    label_L2: 'L₂',
    label_theta1: 'θ₁',
    label_theta2: 'θ₂',
    label_omega1: 'ω₁',
    label_omega2: 'ω₂',
    label_g: 'g (m/s²)',
    damping_enabled: 'Ενεργοποίηση',
    damping_coefficient: 'Συντελεστής',
    trail_enabled: 'Εμφάνιση ίχνους',
    trail_infinite: 'Απεριόριστο ίχνος',
    trail_duration: 'Διάρκεια',
    chaos_title: 'Χάρτης Χάους',
    chaos_subtitle: 'Κάνε κλικ για να επιλέξεις αρχικές συνθήκες',
    chaos_axis_x: 'Άξονας X',
    chaos_axis_y: 'Άξονας Y',
    axis_theta1: 'θ₁ (γωνία 1)',
    axis_theta2: 'θ₂ (γωνία 2)',
    axis_omega1: 'ω₁ (γωνιακή ταχύτητα 1)',
    axis_omega2: 'ω₂ (γωνιακή ταχύτητα 2)',
    chaos_legend_stable: 'Σταθερό',
    chaos_legend_chaotic: 'Χαοτικό',
    recompute_chaos: 'Επανυπολογισμός',
    chaos_grid_label: 'Εμφάνιση πλέγματος',
    chaos_info_title: 'Τι σημαίνει;',
    chaos_info_text: 'Το χρώμα δείχνει πόσο χαοτική είναι η κίνηση για κάθε σύνολο αρχικών συνθηκών. Στις χαοτικές περιοχές, μια πολύ μικρή αλλαγή στην αρχή οδηγεί σε εντελώς διαφορετική τροχιά.',
    chaos_loading: 'Υπολογισμός... {percent}%',

    // Tutorial
    tutorial_step_label: 'Βήμα {current} / {total}',
    tutorial_skip: 'Παράλειψη',
    tutorial_next: 'Επόμενο',
    tutorial_finish: 'Τέλος',
    tutorial_canvas_title: 'Καμβάς Προσομοίωσης',
    tutorial_canvas_text: 'Παρακολούθησε το διπλό εκκρεμές σε κίνηση. Ο πρώτος βραχίονας κρέμεται από τον άξονα και ο δεύτερος από τον πρώτο.',
    tutorial_play_title: 'Αναπαραγωγή / Παύση',
    tutorial_play_text: 'Ξεκίνα ή πάγωσε την προσομοίωση. Μπορείς και με το Space.',
    tutorial_reset_title: 'Επαναφορά',
    tutorial_reset_text: 'Επαναφορά του εκκρεμούς στην αρχική του κατάσταση. Μπορείς και με R.',
    tutorial_speed_title: 'Ταχύτητα',
    tutorial_speed_text: 'Ρύθμισε πόσο γρήγορα τρέχει η προσομοίωση.',
    tutorial_masses_title: 'Μάζες',
    tutorial_masses_text: 'Άλλαξε τις μάζες για να δεις πώς εξελίσσεται η κίνηση και πώς αλληλεπιδρούν οι δύο βραχίονες.',
    tutorial_lengths_title: 'Μήκη',
    tutorial_lengths_text: 'Ρύθμισε τα μήκη για να αλλάξεις πόσο μακριά φτάνει κάθε βραχίονας.',
    tutorial_angles_title: 'Αρχικές Γωνίες',
    tutorial_angles_text: 'Όρισε τις αρχικές γωνίες. 0° είναι προς τα κάτω, 90° είναι οριζόντια.',
    tutorial_velocities_title: 'Αρχικές Ταχύτητες',
    tutorial_velocities_text: 'Δώσε μια αρχική ώθηση στο εκκρεμές ρυθμίζοντας τις γωνιακές ταχύτητες.',
    tutorial_trail_title: 'Ίχνος',
    tutorial_trail_text: 'Ενεργοποίησε το ίχνος για να αποκαλύψεις όμορφα μοτίβα κίνησης.',
    tutorial_chaos_toggle_title: 'Χάρτης Χάους',
    tutorial_chaos_toggle_text: 'Άνοιξε τον χάρτη χάους για να εξερευνήσεις αρχικές συνθήκες.',
    tutorial_chaos_panel_title: 'Χάρτης Χάους',
    tutorial_chaos_panel_text: 'Κάθε σημείο αντιστοιχεί σε διαφορετικές αρχικές συνθήκες. Κάνε κλικ σε ένα σημείο για να δεις την κίνηση που προκύπτει.',

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
    selection_title: 'Πανελλήνιοι Διαγωνισμοί',
    selection_intro: 'Διαγωνισμοί εντός Ελλάδας και πώς οδηγούν σε διεθνείς Ολυμπιάδες.',
    selection_math_title: 'Μαθηματικά',
    selection_math_national: 'Ελλάδα: Οι <a href="https://www.hms.gr/diagonismoi/" target="_blank" rel="noopener">γύροι της Ελληνικής Μαθηματικής Εταιρείας</a> (Θαλής → Ευκλείδης → Αρχιμήδης) οδηγούν στην προκριματική εξέταση για τις εθνικές ομάδες.',
    selection_math_international: 'Διεθνείς: <a href="https://imo-official.org/" target="_blank" rel="noopener">IMO</a>, <a href="https://bmo-olympiad.org/" target="_blank" rel="noopener">BMO (Βαλκανική)</a>, <a href="https://www.egmo.org/" target="_blank" rel="noopener">EGMO</a>.',
    selection_physics_title: 'Φυσική',
    selection_physics_national: 'Ελλάδα: Ο Πανελλήνιος Διαγωνισμός Φυσικής "Αριστοτέλης" (<a href="https://www.eef.gr/" target="_blank" rel="noopener">ΕΕΦ</a>) είναι η επίσημη διαδρομή επιλογής· οι κορυφαίοι μαθητές μπαίνουν σε προπόνηση και στην εθνική ομάδα.',
    selection_physics_international: 'Διεθνείς: <a href="https://www.ipho-new.org/" target="_blank" rel="noopener">IPhO</a>, <a href="https://balkanphysicsolympiad.com/" target="_blank" rel="noopener">BPO (Βαλκανική)</a>, <a href="https://eupho.org/" target="_blank" rel="noopener">EuPhO</a>.',
    selection_informatics_title: 'Πληροφορική',
    selection_informatics_national: 'Ελλάδα: Ο <a href="https://www.e-olymp.gr/" target="_blank" rel="noopener">Πανελλήνιος Διαγωνισμός Πληροφορικής</a> επιλέγει και προετοιμάζει την εθνική ομάδα.',
    selection_informatics_international: 'Διεθνείς: <a href="https://ioinformatics.org/" target="_blank" rel="noopener">IOI</a>, BOI, EJOI, <a href="https://ioai-official.org/" target="_blank" rel="noopener">IOAI</a>.',
    selection_astronomy_title: 'Αστρονομία',
    selection_astronomy_national: 'Ελλάδα: Ο <a href="https://astronomos.gr/apotelesmata-3is-fasis-ptolemaios-lykeiou-27os-panellinios-diagonismos-astronomias/" target="_blank" rel="noopener">Πανελλήνιος Διαγωνισμός Αστρονομίας & Αστροφυσικής</a> περιλαμβάνει πολλές φάσεις· η τελική φάση έχει χρησιμοποιηθεί για την επιλογή των ομάδων IOAA.',
    selection_astronomy_international: 'Διεθνείς: <a href="https://ioaastrophysics.org/" target="_blank" rel="noopener">IOAA</a>.',
    selection_research_title: 'Επιστήμη & Έρευνα',
    selection_research_national: 'Ελλάδα: Η <a href="https://iynt.eef.gr/" target="_blank" rel="noopener">Ελληνική Φυσική Εταιρεία</a> συντονίζει την ελληνική συμμετοχή και τον σχηματισμό ομάδων για το IYPT και το IYNT.',
    selection_research_international: 'Διεθνείς: <a href="https://www.iypt.org/" target="_blank" rel="noopener">IYPT</a>, <a href="https://iynt.eef.gr/" target="_blank" rel="noopener">IYNT</a>.',
    competitions_title: 'Διεθνείς Διαγωνισμοί',
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

    // Footer
    footer_text: '© 2025 STEMfy.gr - Φτιαγμένο με ❤ από τρεις περίεργους μαθητές',

    // Settings
    settings: 'Ρυθμίσεις',
    language: 'Γλώσσα',
    theme: 'Θέμα',
    english: 'English',
    greek: 'Ελληνικά',
    purple: 'Μωβ',
    blue: 'Μπλε',
    custom: 'Προσαρμοσμένο'
  }
};

// Theme configurations
const THEMES = {
  purple: {
    '--bg-deep': '#0a0812',
    '--bg-surface': 'rgba(18, 12, 28, 0.85)',
    '--bg-panel': 'rgba(18, 12, 28, 0.9)',
    '--purple-dim': '#2a1a4a',
    '--purple-mid': '#6a4a9e',
    '--purple-bright': '#b08af0',
    '--purple-glow': '#d4a0ff',
    '--accent': '#ff7aec',
    '--accent-cyan': '#6bfff0'
  },
  blue: {
    '--bg-deep': '#0a0f18',
    '--bg-surface': 'rgba(10, 20, 35, 0.85)',
    '--bg-panel': 'rgba(10, 20, 35, 0.9)',
    '--purple-dim': '#1a3a5a',
    '--purple-mid': '#3a6a9e',
    '--purple-bright': '#6ba3d4',
    '--purple-glow': '#a0d4ff',
    '--accent': '#6bfff0',
    '--accent-cyan': '#4affff'
  }
};

class I18nManager {
  constructor() {
    // Default to English ('en') but allow user to have previously set a language
    const storedLanguage = localStorage.getItem('stemfy-language');
    this.currentLanguage = (storedLanguage && storedLanguage in I18N) ? storedLanguage : 'en';
    this.currentTheme = localStorage.getItem('stemfy-theme') || 'purple';
    this.initialize();
  }

  initialize() {
    this.applyTheme(this.currentTheme);
    this.applyLanguage(this.currentLanguage);
    this.updatePageContent();
  }

  setLanguage(lang) {
    if (lang in I18N) {
      this.currentLanguage = lang;
      localStorage.setItem('stemfy-language', lang);
      this.applyLanguage(lang);
      this.updatePageContent();
    }
  }

  setTheme(theme) {
    if (theme in THEMES) {
      this.currentTheme = theme;
      localStorage.setItem('stemfy-theme', theme);
      this.applyTheme(theme);
    }
  }

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme in THEMES) {
      Object.entries(THEMES[theme]).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }

  applyLanguage(lang) {
    if (lang === 'el') {
      document.documentElement.lang = 'el';
    } else {
      document.documentElement.lang = 'en';
    }
  }

  t(key) {
    return I18N[this.currentLanguage][key] || I18N.en[key] || key;
  }

  setTextById(id, key) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = this.t(key);
    }
  }

  setHTMLById(id, key) {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = this.t(key);
    }
  }

  setAttrById(id, attr, key) {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute(attr, this.t(key));
    }
  }

  applyDataI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });
  }

  setTextBySelector(selector, key) {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = this.t(key);
    }
  }

  setTextForAll(selector, key) {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = this.t(key);
    });
  }

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
    } else if (path.includes('double-pendulum')) {
      this.updateDoublePendulumPage();
    } else if (path.includes('404')) {
      this.update404Page();
    } else {
      // Homepage
      this.updateHomePage();
    }

    this.applyDataI18n();
  }

  updateNavigation() {
    this.setTextForAll('a[href="about.html"]', 'about');
    this.setTextForAll('a[href="contact.html"]', 'contact');
    this.setAttrById('settings-btn', 'aria-label', 'settings');
    this.setAttrById('settings-btn', 'title', 'settings');
  }

  updateFooter() {
    const footer = document.querySelector('footer p');
    if (footer) footer.textContent = this.t('footer_text');
  }

  updateSettingsModal() {
    const settingsTitle = document.getElementById('settings-title');
    const languageLabel = document.getElementById('language-label');
    const themeLabel = document.getElementById('theme-label');
    const languageSelect = document.getElementById('language-select');
    const themeSelect = document.getElementById('theme-select');

    if (settingsTitle) settingsTitle.textContent = this.t('settings');
    if (languageLabel) languageLabel.textContent = this.t('language');
    if (themeLabel) themeLabel.textContent = this.t('theme');

    if (languageSelect && languageSelect.options.length >= 2) {
      languageSelect.options[0].textContent = this.t('english');
      languageSelect.options[1].textContent = this.t('greek');
    }

    if (themeSelect && themeSelect.options.length >= 2) {
      themeSelect.options[0].textContent = this.t('purple');
      themeSelect.options[1].textContent = this.t('blue');
    }
  }

  updateHomePage() {
    // Update hero badge
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
      const span = heroBadge.querySelector('span:not(.pulse)');
      if (span) span.textContent = this.t('badge_text');
    }

    // Update hero title and subtitle
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) heroTitle.textContent = this.t('hero_title');

    const tagline = document.querySelector('.hero .tagline');
    if (tagline) {
      const subtitle = this.t('hero_subtitle');
      const parts = subtitle.split('. ');
      if (parts.length > 1) {
        tagline.innerHTML = `<strong>${parts[0]}.</strong> ${parts.slice(1).join('. ')}`;
      } else {
        tagline.textContent = subtitle;
      }
    }

    // Update nav cards
    const cards = document.querySelectorAll('.nav-card');
    const cardData = [
      { key: 'simulations', descKey: 'simulations_desc' },
      { key: 'news', descKey: 'news_desc' },
      { key: 'challenges', descKey: 'challenges_desc' },
      { key: 'posts', descKey: 'posts_desc' }
    ];

    cards.forEach((card, index) => {
      if (index < cardData.length) {
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        if (h3) h3.textContent = this.t(cardData[index].key);
        if (p) p.textContent = this.t(cardData[index].descKey);
      }
    });
  }

  updateAboutPage() {
    this.setTextById('about-title', 'about_title');
    this.setTextById('about-who-title', 'about_who_we_are');
    this.setTextById('about-who-text', 'about_who_text');
    this.setTextById('about-stemfy-title', 'about_stemfy_title');
    this.setTextById('about-stemfy-text', 'about_stemfy_text');
    this.setTextById('about-motto-label', 'about_motto');
    this.setTextById('about-motto-text', 'about_motto_text');
    this.setTextById('about-contact-title', 'about_contact_title');
    this.setTextById('about-back-link', 'back_home');
  }

  updateSimulationsPage() {
    this.setTextById('simulations-title', 'simulations_title');
    this.setTextById('simulations-subtitle', 'simulations_subtitle');
    this.setTextById('sim-pendulum-title', 'sim_pendulum_title');
    this.setTextById('sim-pendulum-desc', 'sim_pendulum_desc');
    this.setTextById('sim-pendulum-badge', 'available');
    this.setTextById('sim-bridge-title', 'sim_bridge_title');
    this.setTextById('sim-bridge-desc', 'sim_bridge_desc');
    this.setTextById('sim-bridge-badge', 'coming_soon');
    this.setTextById('sim-mandelbrot-title', 'sim_mandelbrot_title');
    this.setTextById('sim-mandelbrot-desc', 'sim_mandelbrot_desc');
    this.setTextById('sim-mandelbrot-badge', 'coming_soon');
    this.setTextById('simulations-back-link', 'back_home');
  }

  updateDoublePendulumPage() {
    this.setTextById('pendulum-title', 'pendulum_title');
    this.setTextById('controls-title', 'controls_title');
    this.setTextById('speed-label', 'speed_label');

    this.setTextById('section-masses-title', 'section_masses_title');
    this.setTextById('section-lengths-title', 'section_lengths_title');
    this.setTextById('section-angles-title', 'section_angles_title');
    this.setTextById('section-velocities-title', 'section_velocities_title');
    this.setTextById('section-gravity-title', 'section_gravity_title');
    this.setTextById('section-damping-title', 'section_damping_title');
    this.setTextById('section-trail-title', 'section_trail_title');

    this.setTextById('label-m1', 'label_m1');
    this.setTextById('label-m2', 'label_m2');
    this.setTextById('label-L1', 'label_L1');
    this.setTextById('label-L2', 'label_L2');
    this.setTextById('label-theta1', 'label_theta1');
    this.setTextById('label-theta2', 'label_theta2');
    this.setTextById('label-omega1', 'label_omega1');
    this.setTextById('label-omega2', 'label_omega2');
    this.setTextById('label-g', 'label_g');

    this.setTextById('damping-enabled-label', 'damping_enabled');
    this.setTextById('damping-coefficient-label', 'damping_coefficient');
    this.setTextById('trail-enabled-label', 'trail_enabled');
    this.setTextById('trail-infinite-label', 'trail_infinite');
    this.setTextById('trail-duration-label', 'trail_duration');

    this.setTextById('chaos-title', 'chaos_title');
    this.setTextById('chaos-subtitle', 'chaos_subtitle');
    this.setTextById('chaos-axis-x-label', 'chaos_axis_x');
    this.setTextById('chaos-axis-y-label', 'chaos_axis_y');
    this.setTextById('chaos-legend-stable', 'chaos_legend_stable');
    this.setTextById('chaos-legend-chaotic', 'chaos_legend_chaotic');
    this.setTextById('chaos-grid-label', 'chaos_grid_label');
    this.setTextById('recompute-chaos', 'recompute_chaos');
    this.setTextById('chaos-info-title', 'chaos_info_title');
    this.setTextById('chaos-info-text', 'chaos_info_text');

    this.setAttrById('tutorial-btn', 'aria-label', 'tutorial');
    this.setAttrById('tutorial-btn', 'title', 'tutorial');
    this.setAttrById('controls-toggle-btn', 'aria-label', 'open_controls');
    this.setAttrById('chaos-toggle-btn', 'aria-label', 'open_chaos');
    this.setAttrById('chaos-toggle', 'aria-label', 'toggle_chaos');
    this.setAttrById('reset-btn', 'aria-label', 'reset_label');

    const loadingText = document.getElementById('chaos-loading-text');
    if (loadingText) {
      loadingText.textContent = this.t('chaos_loading').replace('{percent}', '0');
    }

    if (typeof updateViewToggleLabel === 'function' &&
        typeof getStoredViewPreference === 'function' &&
        typeof getEffectiveViewMode === 'function') {
      const preference = getStoredViewPreference();
      const effective = getEffectiveViewMode(preference);
      updateViewToggleLabel(effective);
    }

    if (typeof updatePlayButton === 'function') {
      updatePlayButton();
    }
  }

  updateChallengesPage() {
    this.setTextById('challenges-title', 'challenges_title');
    this.setTextById('challenges-subtitle', 'challenges_subtitle');
    this.setTextById('challenges-intro', 'challenges_intro');

    this.setTextById('challenge-pendulum-title', 'challenge_pendulum_trajectory');
    this.setTextById('challenge-pendulum-desc', 'challenge_pendulum_trajectory_desc');
    this.setTextById('challenge-pendulum-badge', 'available');
    this.setTextById('challenge-pendulum-try', 'try_simulation');
    this.setTextById('challenge-pendulum-submit', 'submit_instagram');

    this.setTextById('challenge-chaos-title', 'challenge_chaos_map');
    this.setTextById('challenge-chaos-desc', 'challenge_chaos_map_desc');
    this.setTextById('challenge-chaos-badge', 'available');
    this.setTextById('challenge-chaos-try', 'try_simulation');
    this.setTextById('challenge-chaos-submit', 'submit_instagram');

    this.setTextById('challenge-mandelbrot-title', 'challenge_mandelbrot');
    this.setTextById('challenge-mandelbrot-desc', 'challenge_mandelbrot_desc');
    this.setTextById('challenge-mandelbrot-badge', 'coming_soon');
    this.setTextById('challenge-mandelbrot-soon', 'coming_soon');

    this.setTextById('challenge-bridge-title', 'challenge_bridge');
    this.setTextById('challenge-bridge-desc', 'challenge_bridge_desc');
    this.setTextById('challenge-bridge-badge', 'coming_soon');
    this.setTextById('challenge-bridge-soon', 'coming_soon');
  }

  updateContactPage() {
    this.setTextById('contact-title', 'contact_title');
    this.setTextById('contact-subtitle', 'contact_subtitle');
    this.setTextById('contact-instagram-label', 'contact_instagram');
    this.setTextById('contact-email-label', 'contact_email');
  }

  updateNewsPage() {
    this.setTextById('news-title', 'news_title');
    this.setTextById('news-subtitle', 'news_subtitle');
    this.setTextById('newsletter-title', 'newsletter_title');
    this.setTextById('newsletter-desc', 'newsletter_desc');
    this.setTextById('newsletter-coming', 'newsletter_coming');
    this.setTextById('competitions-title', 'competitions_title');
    this.setTextById('competitions-intro', 'competitions_intro');
    this.setTextById('comp-math-title', 'comp_math');
    this.setTextById('comp-physics-title', 'comp_physics');
    this.setTextById('comp-informatics-title', 'comp_informatics');
    this.setTextById('comp-science-title', 'comp_science');
    this.setTextById('comp-astronomy-title', 'comp_astronomy');

    this.setTextById('selection-title', 'selection_title');
    this.setTextById('selection-intro', 'selection_intro');
    this.setTextById('selection-math-title', 'selection_math_title');
    this.setTextById('selection-physics-title', 'selection_physics_title');
    this.setTextById('selection-informatics-title', 'selection_informatics_title');
    this.setTextById('selection-astronomy-title', 'selection_astronomy_title');
    this.setTextById('selection-research-title', 'selection_research_title');

    this.setHTMLById('selection-math-national', 'selection_math_national');
    this.setHTMLById('selection-math-international', 'selection_math_international');
    this.setHTMLById('selection-physics-national', 'selection_physics_national');
    this.setHTMLById('selection-physics-international', 'selection_physics_international');
    this.setHTMLById('selection-informatics-national', 'selection_informatics_national');
    this.setHTMLById('selection-informatics-international', 'selection_informatics_international');
    this.setHTMLById('selection-astronomy-national', 'selection_astronomy_national');
    this.setHTMLById('selection-astronomy-international', 'selection_astronomy_international');
    this.setHTMLById('selection-research-national', 'selection_research_national');
    this.setHTMLById('selection-research-international', 'selection_research_international');
  }

  updatePostsPage() {
    this.setTextById('posts-title', 'posts_title');
    this.setTextById('posts-subtitle', 'posts_subtitle');
    this.setTextById('posts-instagram-title', 'posts_instagram_title');
    this.setTextById('posts-instagram-desc', 'posts_instagram_desc');
    this.setTextById('posts-resources-title', 'posts_resources_title');
    this.setTextById('posts-resources-desc', 'posts_resources_desc');
    this.setTextForAll('.posts-placeholder-text', 'posts_no_content');
  }

  update404Page() {
    this.setTextById('error-code', 'error_404');
    this.setTextById('error-title', 'error_title');
    this.setTextById('error-message', 'error_message');
    this.setTextById('error-back-link', 'back_home');
  }
}

// Initialize on page load
let i18nManager;
document.addEventListener('DOMContentLoaded', () => {
  i18nManager = new I18nManager();
  window.i18nManager = i18nManager;
});

