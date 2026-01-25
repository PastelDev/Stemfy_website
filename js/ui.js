/* ============================================
   STEMfy.gr - UI Interactions Handler
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Settings Modal
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const settingsClose = document.getElementById('settings-close');
  const languageSelect = document.getElementById('language-select');
  const themeSelect = document.getElementById('theme-select');

  // Open settings modal
  if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsModal.classList.add('active');
      // Update selects to current values
      languageSelect.value = window.i18nManager?.currentLanguage || 'en';
      if (themeSelect) {
        themeSelect.value = window.i18nManager?.currentTheme || 'purple';
      }
      updateSettingsLabels();
    });
  }

  // Close settings modal
  if (settingsClose) {
    settingsClose.addEventListener('click', () => {
      settingsModal.classList.remove('active');
    });
  }

  // Close modal on outside click
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
      }
    });
  }

  // Language select change
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      window.i18nManager?.setLanguage(e.target.value);
      updateSettingsLabels();
    });
  }

  // Theme select change
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      window.i18nManager?.setTheme(e.target.value);
    });
  }

  function updateSettingsLabels() {
    const i18n = window.i18nManager;
    if (!i18n) return;

    const settingsTitle = document.getElementById('settings-title');
    const languageLabel = document.getElementById('language-label');
    const themeLabel = document.getElementById('theme-label');

    if (settingsTitle) settingsTitle.textContent = i18n.t('settings');
    if (languageLabel) languageLabel.textContent = i18n.t('language');
    if (themeLabel) themeLabel.textContent = i18n.t('theme');

    // Update select options
    if (languageSelect && languageSelect.options.length >= 2) {
      const options = languageSelect.options;
      options[0].textContent = i18n.t('english');
      options[1].textContent = i18n.t('greek');
    }

    if (themeSelect && themeSelect.options.length >= 2) {
      const themeOptions = themeSelect.options;
      themeOptions[0].textContent = i18n.t('purple');
      themeOptions[1].textContent = i18n.t('blue');
    }
  }

  // Initial update of settings labels
  setTimeout(updateSettingsLabels, 100);
});
