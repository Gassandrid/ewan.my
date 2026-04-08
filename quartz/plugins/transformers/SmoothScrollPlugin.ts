import { QuartzTransformerPlugin } from "../types"

// Velocity-based scroll physics. Each wheel tick adds to velocity; friction decays it each frame.
// The weight is felt at the instant of first motion — the page eases in from rest rather than
// snapping to full speed. FRICTION controls deceleration; ACCEL controls initial responsiveness.
const SMOOTH_SCROLL_SCRIPT = `
(function() {
  if (window._smoothScrollInit) return;
  window._smoothScrollInit = true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var posY = 0;
  var velocity = 0;
  var rafId = null;
  var FRICTION = 0.82;
  var ACCEL = 0.52;

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function normalizeDelta(e) {
    var d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;
    if (e.deltaMode === 2) d *= window.innerHeight;
    return d;
  }

  function tick() {
    velocity *= FRICTION;
    posY = Math.max(0, Math.min(posY + velocity, maxScroll()));
    window.scrollTo(0, posY);

    if (Math.abs(velocity) < 0.1) {
      velocity = 0;
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function onWheel(e) {
    var el = e.target;
    while (el && el !== document.body) {
      var oy = window.getComputedStyle(el).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 10) {
        return;
      }
      el = el.parentElement;
    }
    e.preventDefault();
    if (!rafId) posY = window.scrollY;
    velocity += normalizeDelta(e) * ACCEL;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function init() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    velocity = 0;
    posY = window.scrollY;
    window.removeEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('wheel', onWheel, { passive: false });
  }

  document.addEventListener('nav', init);
  init();
})();
`

export const SmoothScrollPlugin: QuartzTransformerPlugin = () => ({
  name: "SmoothScrollPlugin",

  externalResources() {
    return {
      js: [
        {
          contentType: "inline",
          loadTime: "afterDOMReady",
          spaPreserve: true,
          script: SMOOTH_SCROLL_SCRIPT,
        },
      ],
      css: [],
    }
  },
})
