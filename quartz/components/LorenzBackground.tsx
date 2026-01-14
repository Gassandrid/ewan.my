// @ts-ignore
import lorenzScript from "./scripts/lorenzBackground.inline"
import lorenzStyle from "./styles/lorenzBackground.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const LorenzBackground: QuartzComponent = (_props: QuartzComponentProps) => {
  return <canvas id="lorenz-canvas" />
}

LorenzBackground.afterDOMLoaded = lorenzScript
LorenzBackground.css = lorenzStyle

export default (() => LorenzBackground) satisfies QuartzComponentConstructor
