import { CustomPageDef } from "../types"
import { StatCard, DataGrid, Section, Chart } from "../components"
import { FullSlug } from "../../util/path"

const DemoPage: CustomPageDef = {
  slug: "custom/demo" as FullSlug,
  title: "Custom Page Demo",
  tags: ["meta"],
  description: "Demonstration of the custom Preact page toolkit",
  body: () => (
    <div class="custom-page">
      <Section title="Stat Cards">
        <DataGrid cols={3}>
          <StatCard label="Pages" value="770" color="ochre" />
          <StatCard label="Tags" value="42" color="sage" />
          <StatCard label="Links" value="1,203" color="pine" />
        </DataGrid>
      </Section>

      <Section title="HRV Chart">
        <Chart
          id="demo-hrv"
          type="line"
          source="/static/data/demo-hrv.json"
          x="date"
          y="hrv_ms"
          title="Heart Rate Variability"
          color="sage"
          xLabel="Date"
          yLabel="HRV (ms)"
          height={340}
        />
      </Section>

      <Section title="Extraction Scatter">
        <Chart
          id="demo-extraction"
          type="scatter"
          source="/static/data/demo-extraction.csv"
          x="grind_size"
          y="extraction_yield"
          title="Grind Size vs Extraction Yield"
          color="ochre"
          xLabel="Grind Size (micron)"
          yLabel="Extraction Yield (%)"
          height={360}
        />
      </Section>

      <Section title="Multi-series">
        <DataGrid cols={2}>
          <Chart
            id="demo-area"
            type="area"
            source="/static/data/demo-hrv.json"
            x="date"
            y="hrv_ms"
            title="HRV Trend"
            color="pine"
            height={280}
          />
          <Chart
            id="demo-rhr"
            type="line"
            source="/static/data/demo-hrv.json"
            x="date"
            y="resting_hr"
            title="Resting Heart Rate"
            color="rust"
            height={280}
            dots={true}
          />
        </DataGrid>
      </Section>
    </div>
  ),
}

export default DemoPage
