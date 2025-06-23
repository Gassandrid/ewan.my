import { QuartzFilterPlugin } from "../types"

export const OnlyStandardPages: QuartzFilterPlugin = () => ({
  name: "OnlyStandardPages",
  shouldPublish(_ctx, [_, vfile]) {
    const fileClass = vfile.data?.frontmatter?.fileClass
    const result = fileClass !== "page"
    if (!result) {
      console.log(`[OnlyStandardPages] Excluding file with fileClass: page (${vfile.data?.slug})`)
    }
    return result
  },
}) 