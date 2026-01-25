/* ============================================
   STEMfy.gr - UI Interactions Handler
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const settingsBtn = document.getElementById('settings-btn');

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      const i18n = window.i18nManager;
      if (!i18n) return;
      const nextLanguage = i18n.currentLanguage === 'en' ? 'el' : 'en';
      i18n.setLanguage(nextLanguage);
    });
  }
});
