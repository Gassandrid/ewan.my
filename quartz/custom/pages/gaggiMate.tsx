import { CustomPageDef } from "../types"
import { CalPlot } from "../components"
import { FullSlug } from "../../util/path"

const GaggiMatePage: CustomPageDef = {
  slug: "Pages/gaggiMate-extractions" as FullSlug,
  title: "GaggiMate Extractions",
  tags: ["coffee", "data", "quantified-self"],
  description: "(test site for now)Espresso extraction tracking and analysis via GaggiMate",
  body: () => (
    <div class="custom-page">
      <p style="color: var(--gray); font-size: 0.85rem; margin-bottom: 1.5rem;">
        Extraction data from a Gaggia Classic Pro with GaggiMate mod. Click a day to see shot
        profiles with pressure, flow, weight, and temperature overlaid.
      </p>
      <CalPlot
        id="gaggimate-cal"
        source="/static/data/gaggimate-calendar.json"
        year={2025}
        month={2}
      />
    </div>
  ),
}

export default GaggiMatePage
