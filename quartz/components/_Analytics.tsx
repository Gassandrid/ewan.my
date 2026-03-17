import { QuartzComponent, QuartzComponentConstructor } from "./types"

// Headless component — renders nothing, loads telemetry.js after DOM is ready
const Analytics: QuartzComponent = () => <></>

Analytics.afterDOMLoaded = `
  var _s = document.createElement('script')
  _s.src = '/static/telemetry.js'
  document.head.appendChild(_s)
`

export default (() => Analytics) satisfies QuartzComponentConstructor
