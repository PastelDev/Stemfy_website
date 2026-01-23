# STEMfy.gr — Διαδραστικές Προσομοιώσεις

![STEMfy.gr](https://img.shields.io/badge/STEMfy.gr-Το%20STEM%2C%20for%20You!-blue?style=for-the-badge)

Καλώς ήρθες στο επίσημο repository του [STEMfy.gr](https://pasteldev.github.io)! 

Εδώ φιλοξενούνται διαδραστικές προσομοιώσεις φυσικής και μαθηματικών, σχεδιασμένες για να κάνουν την επιστήμη προσιτή και διασκεδαστική.

## 🌌 Προσομοιώσεις

- **[Διπλό Εκκρεμές](https://pasteldev.github.io/double-pendulum.html)** — Εξερεύνησε το χάος σε ένα απλό σύστημα. Διαδραστική προσομοίωση φυσικής με προσαρμόσιμες παραμέτρους, χάρτη χάους και διδακτικό σύστημα.

## 🚀 Εγκατάσταση Τοπικά

```bash
# Clone το repository
git clone https://github.com/pasteldev/pasteldev.github.io.git

# Μπες στον φάκελο
cd pasteldev.github.io

# Άνοιξε με έναν local server (π.χ. με Python)
python -m http.server 8000

# Ή με Node.js
npx serve
```

Στη συνέχεια, άνοιξε τον browser σου στο `http://localhost:8000`

## 📁 Δομή Αρχείων

```
pasteldev.github.io/
├── index.html              # Αρχική σελίδα
├── double-pendulum.html    # Προσομοίωση διπλού εκκρεμούς
├── about.html              # Σχετικά με εμάς
├── css/
│   ├── main.css            # Κύρια styles
│   └── simulations.css     # Styles για προσομοιώσεις
├── js/
│   ├── common.js           # Κοινές συναρτήσεις (starfield, utilities)
│   ├── double-pendulum.js  # Φυσική και UI διπλού εκκρεμούς
│   └── tutorial.js         # Σύστημα tutorial
├── descriptions/
│   ├── double-pendulum.md  # Περιγραφή διπλού εκκρεμούς
│   ├── mandelbrot.md       # Περιγραφή Mandelbrot
│   └── bridge-builder.md   # Περιγραφή κατασκευαστή γέφυρας
└── README.md
```

## 🎨 Design System

- **Fonts**: Press Start 2P (pixel headers), Inter (body)
- **Colors**: Deep navy (#0a0a1a), Bright blue (#4a9eff), White
- **Style**: Pixel art accents, space/galaxy theme, minimalist UI

## 🔧 Τεχνολογίες

- Vanilla JavaScript (ES6+)
- HTML5 Canvas για rendering
- CSS3 με custom properties
- Χωρίς dependencies!

## 📱 Mobile Support

Η σελίδα είναι πλήρως responsive με:
- Touch-friendly controls
- Collapsible panels σε μικρές οθόνες
- Minimum touch target 44px

## 🤝 Συνεισφορά

Θέλεις να βοηθήσεις; 
1. Fork το repository
2. Δημιούργησε ένα branch (`git checkout -b feature/amazing-feature`)
3. Commit τις αλλαγές (`git commit -m 'Add amazing feature'`)
4. Push στο branch (`git push origin feature/amazing-feature`)
5. Άνοιξε ένα Pull Request

## 📬 Επικοινωνία

- **Instagram**: [@stemfy.gr](https://instagram.com/stemfy.gr)
- **Email**: stelirapt7@gmail.com

## 📄 Άδεια

Αυτό το project είναι open source και διατίθεται υπό την [MIT License](LICENSE). Μη διστάσεις να το χρησιμοποιήσεις για εκπαιδευτικούς σκοπούς!

---

**Το STEM, for You!** 🚀
