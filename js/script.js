/* ===================================================
   CV DIGITAL — Yahir Valenzuela
   Controles: idioma (ES/EN), tema (light/dark) y PDF ATS
=================================================== */

(function () {
  'use strict';

  /* --------------------- ESTADO INICIAL --------------------- */
  const PREFERS_DARK = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentLang  = 'es';
  let currentTheme = 'light';

  try {
    const savedLang  = localStorage.getItem('cv-lang');
    const savedTheme = localStorage.getItem('cv-theme');
    if (savedLang === 'es' || savedLang === 'en') currentLang = savedLang;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      currentTheme = savedTheme;
    } else if (PREFERS_DARK) {
      currentTheme = 'dark';
    }
  } catch (e) {
    // localStorage puede fallar en modo privado — se ignora
  }

  /* --------------------- APLICAR IDIOMA --------------------- */
  function applyLang(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('data-lang', lang);

    // Actualizar todos los nodos con data-es / data-en
    document.querySelectorAll('[data-es][data-en]').forEach(function (el) {
      const text = el.getAttribute('data-' + lang);
      if (text !== null) el.textContent = text;
    });

    // Botón de idioma
    const langLabel = document.getElementById('lang-label');
    const btnLang   = document.getElementById('btn-lang');
    if (langLabel) langLabel.textContent = lang === 'es' ? 'Translate (ES/EN)' : 'Traducir (ES/EN)';
    if (btnLang)   btnLang.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a Español');

    // <title> SEO
    document.title = lang === 'es'
      ? 'Yahir Valenzuela | Backend Developer Junior · C# · .NET · Node.js · PostgreSQL · Docker · Zapopan'
      : 'Yahir Valenzuela | Junior Backend Developer · C# · .NET · Node.js · PostgreSQL · Docker · Zapopan';

    currentLang = lang;
    try { localStorage.setItem('cv-lang', lang); } catch (e) {}
  }

  /* --------------------- APLICAR TEMA --------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const themeLabel = document.getElementById('theme-label');
    const iconPath   = document.getElementById('icon-path');

    if (themeLabel) {
      const labels = {
        es: theme === 'dark' ? 'Modo claro'  : 'Modo oscuro',
        en: theme === 'dark' ? 'Light mode'  : 'Dark mode'
      };
      themeLabel.textContent = labels[currentLang];
      themeLabel.setAttribute('data-es', theme === 'dark' ? 'Modo claro'  : 'Modo oscuro');
      themeLabel.setAttribute('data-en', theme === 'dark' ? 'Light mode'  : 'Dark mode');
    }

    // Cambiar icono sol/luna
    if (iconPath) {
      if (theme === 'dark') {
        // Icono luna
        iconPath.setAttribute('d', 'M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z');
      } else {
        // Icono sol
        iconPath.setAttribute('d', 'M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-8a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 3zm0 9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 8 12zm4.95-7.364a.5.5 0 0 1 0 .707l-.707.707a.5.5 0 1 1-.707-.707l.707-.707a.5.5 0 0 1 .707 0zM4.464 11.536a.5.5 0 0 1 0 .707l-.707.707a.5.5 0 1 1-.707-.707l.707-.707a.5.5 0 0 1 .707 0zm7.729-3.536a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1A.5.5 0 0 1 3 8zm9.657 2.757a.5.5 0 0 1-.707 0l-.707-.707a.5.5 0 1 1 .707-.707l.707.707a.5.5 0 0 1 0 .707zM4.95 4.95a.5.5 0 0 1-.707 0l-.707-.707a.5.5 0 1 1 .707-.707l.707.707a.5.5 0 0 1 0 .707z');
      }
    }

    currentTheme = theme;
    try { localStorage.setItem('cv-theme', theme); } catch (e) {}
  }

  /* --------------------- EXPORTAR PDF --------------------- */
  // Usa window.print() nativo con CSS @media print optimizado para ATS.
  // El PDF resultante tiene texto seleccionable (parseable por ATS).
  function exportPDF() {
    const prevTheme = currentTheme;
    if (currentTheme === 'dark') applyTheme('light'); // forzar claro para ATS

    setTimeout(function () {
      window.print();
      setTimeout(function () {
        if (prevTheme === 'dark') applyTheme('dark'); // restaurar
      }, 500);
    }, 100);
  }

  /* --------------------- HANDLERS PÚBLICOS --------------------- */
  window.toggleLang  = function () { applyLang(currentLang === 'es' ? 'en' : 'es'); };
  window.toggleTheme = function () { applyTheme(currentTheme === 'light' ? 'dark' : 'light'); };
  window.exportPDF   = exportPDF;

  /* --------------------- ATAJOS DE TECLADO --------------------- */
  // Ctrl/Cmd + Shift + L → cambiar idioma
  // Ctrl/Cmd + Shift + D → cambiar tema
  document.addEventListener('keydown', function (e) {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod || !e.shiftKey) return;
    if (e.key === 'L' || e.key === 'l') { e.preventDefault(); window.toggleLang(); }
    if (e.key === 'D' || e.key === 'd') { e.preventDefault(); window.toggleTheme(); }
  });

  /* --------------------- INICIALIZACIÓN --------------------- */
  function init() {
    applyTheme(currentTheme);
    applyLang(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Respetar cambios en preferencia del sistema (si el usuario no eligió manualmente)
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) {
      mq.addEventListener('change', function (e) {
        try {
          if (!localStorage.getItem('cv-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        } catch (err) {}
      });
    }
  }

})();