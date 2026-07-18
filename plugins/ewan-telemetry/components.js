import { h } from "preact"
const RUNTIME = `(function(){if(document.querySelector('script[data-ewan-telemetry]'))return;var s=document.createElement('script');s.src='/static/telemetry.js';s.defer=true;s.dataset.ewanTelemetry='true';document.head.appendChild(s)})();`
export function Telemetry() {
  function Component() {
    return h("span", { hidden: true, "aria-hidden": "true", "data-ewan-telemetry-anchor": "" })
  }
  Component.displayName = "Telemetry"
  Component.afterDOMLoaded = RUNTIME
  return Component
}
