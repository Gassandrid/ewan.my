import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"

componentRegistry.setOptionOverrides("citations", {
  bibliographyFile: "content/References.bib",
})

componentRegistry.setOptionOverrides("bases-page", {
  defaultViewType: "table",
  linkResolution: "shortest",
})

componentRegistry.setOptionOverrides("explorer", {
  sortFn: (
    a: { file?: unknown; displayName: string },
    b: { file?: unknown; displayName: string },
  ) => {
    if ((!a.file && !b.file) || (a.file && b.file)) {
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }

    return a.file && !b.file ? 1 : -1
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
