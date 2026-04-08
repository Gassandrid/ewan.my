import { QuartzTransformerPlugin } from "../types"

const ML_INIT_SCRIPT = `
(function() {
  if (window._mlInitRegistered) return;
  window._mlInitRegistered = true;

  function mlThemeSync() {
    if (!window.MorrisLecarTheme) return;
    var shouldBeDark = document.documentElement.getAttribute('saved-theme') === 'dark';
    if (window.MorrisLecarTheme.isDark !== shouldBeDark) {
      window.MorrisLecarTheme._dark = shouldBeDark;
      document.documentElement.classList.toggle('light', !shouldBeDark);
      if (window._mlApp) {
        window._mlApp.ui.updateSwatchColors();
        window._mlApp.scheduleRender();
      }
    }
  }

  function mlInitApp() {
    // Retry until morris-lecar.js has finished loading
    if (!window.MorrisLecarApp) { setTimeout(mlInitApp, 100); return; }
    mlThemeSync();
    // rAF ensures the browser has laid out the page before PhaseRenderer.resize() reads dimensions
    requestAnimationFrame(function() {
      window._mlApp = new window.MorrisLecarApp();
      // Second resize pass after layout fully settles (avoids zero-dimension canvas)
      setTimeout(function() {
        if (window._mlApp) {
          window._mlApp.phaseRenderer.resize();
          window._mlApp.tsRenderer.resize();
          window._mlApp.recompute();
        }
      }, 80);
    });
  }

  function mlInit() {
    if (window._mlApp) { window._mlApp.destroy(); window._mlApp = null; }
    if (!document.getElementById('phase-canvas')) return;
    mlInitApp();
  }

  document.addEventListener('nav', mlInit);
  document.addEventListener('themechange', mlThemeSync);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mlInit);
  } else {
    setTimeout(mlInit, 50);
  }
})();
`

export const MorrisLecarPlugin: QuartzTransformerPlugin = () => ({
  name: "MorrisLecarPlugin",

  externalResources() {
    return {
      js: [
        {
          src: "/static/js/morris-lecar.js",
          loadTime: "afterDOMReady",
          contentType: "external",
          spaPreserve: true,
        },
        {
          contentType: "inline",
          loadTime: "afterDOMReady",
          spaPreserve: true,
          script: ML_INIT_SCRIPT,
        },
      ],
      css: [],
    }
  },
})
