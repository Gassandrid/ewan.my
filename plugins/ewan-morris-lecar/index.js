const ML_INIT_SCRIPT = `
(function() {
  if (window._mlInitRegistered) return;
  window._mlInitRegistered = true;

  function mlThemeSync() {
    if (!window.MorrisLecarTheme) return;
    var shouldBeDark = document.documentElement.getAttribute("saved-theme") === "dark";
    if (window.MorrisLecarTheme.isDark !== shouldBeDark) {
      window.MorrisLecarTheme._dark = shouldBeDark;
      document.documentElement.classList.toggle("light", !shouldBeDark);
      if (window._mlApp) {
        window._mlApp.ui.updateSwatchColors();
        window._mlApp.scheduleRender();
      }
    }
  }

  function mlInitApp() {
    if (!window.MorrisLecarApp) {
      setTimeout(mlInitApp, 100);
      return;
    }
    mlThemeSync();
    requestAnimationFrame(function() {
      window._mlApp = new window.MorrisLecarApp();
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
    if (window._mlApp) {
      window._mlApp.destroy();
      window._mlApp = null;
    }
    if (!document.getElementById("phase-canvas")) return;
    mlInitApp();
  }

  document.addEventListener("nav", mlInit);
  document.addEventListener("themechange", mlThemeSync);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mlInit);
  } else {
    setTimeout(mlInit, 50);
  }
})();
`

export default function EwanMorrisLecar() {
  return {
    name: "EwanMorrisLecar",
    textTransform(_ctx, src) {
      return src
    },
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
            script: ML_INIT_SCRIPT,
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
