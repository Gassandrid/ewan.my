import sharp from "sharp"
import { joinSegments, QUARTZ, FilePath } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"

export const Favicon: QuartzEmitterPlugin = () => ({
  name: "Favicon",
  async *emit({ argv }) {
    const iconPath = joinSegments(QUARTZ, "static", "icon.png")
    const dest = joinSegments(argv.output, "favicon.ico") as FilePath

    await sharp(iconPath).resize(48, 48).toFormat("png").toFile(dest)

    yield dest
  },
  async *partialEmit() {},
})
