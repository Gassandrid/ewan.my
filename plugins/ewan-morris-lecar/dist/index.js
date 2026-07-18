const ML_INIT_SCRIPT = `
(function() {
  if (window._mlInitRegistered) return;
  window._mlInitRegistered = true;
  var mlScriptPromise = null;

  function loadMorrisLecar() {
    if (window.MorrisLecarApp) return Promise.resolve();
    if (mlScriptPromise) return mlScriptPromise;
    mlScriptPromise = new Promise(function(resolve, reject) {
      var existing = document.querySelector('script[data-ewan-morris-lecar]');
      var script = existing || document.createElement("script");
      if (!existing) {
        script.src = "/static/js/morris-lecar.js";
        script.defer = true;
        script.dataset.ewanMorrisLecar = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", function() { reject(new Error("failed to load Morris-Lecar runtime")); }, { once: true });
    });
    return mlScriptPromise;
  }

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

  async function mlInitApp() {
    try {
      await loadMorrisLecar();
      if (!document.getElementById("phase-canvas")) return;
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
    } catch (error) {
      console.error("[morris-lecar]", error);
    }
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
