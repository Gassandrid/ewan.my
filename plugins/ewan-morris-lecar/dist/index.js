const ML_INIT_SCRIPT = `
(function() {
  if (window._mlInitRegistered) return;
  window._mlInitRegistered = true;
  let generation = 0;
  let runtime;
  async function init() {
    const ticket = ++generation;
    window._mlApp?.destroy();
    window._mlApp = null;
    const root = document.getElementById('ml-app');
    if (!root) return;
    try {
      runtime ||= import('/static/js/morris-lecar.js').catch(error => { runtime = null; throw error; });
      const { MorrisLecarApp } = await runtime;
      if (ticket !== generation || !root.isConnected) return;
      window._mlApp = new MorrisLecarApp(root);
    } catch (error) {
      console.error('[morris-lecar]', error);
      if (root.isConnected) root.querySelector('#ml-status').textContent = 'The explorer could not load. Reload to try again.';
    }
  }
  document.addEventListener('nav', init);
  document.addEventListener('themechange', () => window._mlApp?.scheduleRender());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
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
