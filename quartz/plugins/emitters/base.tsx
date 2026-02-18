import { defaultContentPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { FullPageLayout } from "../../cfg"
import { Content, BaseSearchBar, BaseViewSelector } from "../../components"
import { pageResources, renderPage } from "../../components/renderPage"
import { QuartzComponentProps } from "../../components/types"
import { QuartzEmitterPlugin } from "../types"
import { BaseExpressionDiagnostic, BasesExpressions } from "../../util/base/compiler"
import { BaseMetadata, renderBaseViewsForFile } from "../../util/base/render"
import { BuildCtx } from "../../util/ctx"
import { pathToRoot, FullSlug } from "../../util/path"
import { StaticResources } from "../../util/resources"
import { QuartzPluginData } from "../vfile"
import { write } from "./helpers"

async function* emitBaseViewsForFile(
  ctx: BuildCtx,
  baseFileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
  resources: StaticResources,
  layout: FullPageLayout,
) {
  if (!baseFileData.basesConfig || !baseFileData.slug) return
  const baseSlug = baseFileData.slug as FullSlug
  const rendered = renderBaseViewsForFile(baseFileData, allFiles, baseFileData)

  for (const renderedView of rendered.views) {
    const slug = renderedView.slug
    const fileData: QuartzPluginData = { ...baseFileData }
    fileData.slug = slug
    fileData.htmlAst = renderedView.tree
    fileData.frontmatter = {
      ...fileData.frontmatter,
      title: `${fileData.frontmatter?.title || baseSlug} - ${renderedView.view.name}`,
      pageLayout: fileData.frontmatter!.pageLayout || "default",
    }
    fileData.basesMetadata = {
      baseSlug,
      currentView: renderedView.view.name,
      allViews: rendered.allViews,
    }

    const cfg = ctx.cfg.configuration
    const externalResources = pageResources(pathToRoot(slug), resources)
    const componentData: QuartzComponentProps = {
      ctx,
      fileData,
      externalResources,
      cfg,
      children: [],
      tree: renderedView.tree,
      allFiles,
    }

    const content = renderPage(cfg, slug, componentData, layout, externalResources)
    yield write({ ctx, content, slug, ext: ".html" })
  }
}

export const BasePage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    ...userOpts,
    pageBody: Content(),
    beforeBody: [BaseViewSelector(), BaseSearchBar()],
    afterBody: [],
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts

  return {
    name: "BaseViewPage",
    getQuartzComponents() {
      return [Head, ...header, ...beforeBody, pageBody, ...afterBody, ...left, ...right, Footer]
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      const allFiles = content.map((c) => c[1].data)
      const baseFilesBySlug = new Map<FullSlug, QuartzPluginData>()

      for (const [, file] of content) {
        if (file.data.bases && file.data.basesConfig && file.data.slug) {
          baseFilesBySlug.set(file.data.slug as FullSlug, file.data)
        }
      }

      if (baseFilesBySlug.size === 0) {
        return
      }

      const slugsToRebuild = new Set<FullSlug>()
      let rebuildAllBases = false

      for (const changeEvent of changeEvents) {
        if (changeEvent.file) {
          const data = changeEvent.file.data
          if (data.bases && data.slug) {
            slugsToRebuild.add(data.slug as FullSlug)
          } else {
            rebuildAllBases = true
          }
          continue
        }

        if (changeEvent.type === "delete") {
          rebuildAllBases = true
          continue
        }

        const changedPath = changeEvent.path
        for (const [slug, baseData] of baseFilesBySlug.entries()) {
          const deps = (baseData.codeDependencies as string[] | undefined) ?? []
          if (deps.includes(changedPath)) {
            slugsToRebuild.add(slug)
          }
        }
      }

      if (rebuildAllBases) {
        for (const slug of baseFilesBySlug.keys()) {
          slugsToRebuild.add(slug)
        }
      }

      if (slugsToRebuild.size === 0) {
        return
      }

      for (const slug of slugsToRebuild) {
        const baseData = baseFilesBySlug.get(slug)
        if (!baseData) continue
        yield* emitBaseViewsForFile(ctx, baseData, allFiles, resources, opts)
      }
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)

      for (const [, file] of content) {
        if (!file.data.bases || !file.data.basesConfig || !file.data.slug) continue
        yield* emitBaseViewsForFile(ctx, file.data, allFiles, resources, opts)
      }
    },
  }
}

declare module "vfile" {
  interface DataMap {
    basesMetadata: BaseMetadata
    basesDiagnostics?: BaseExpressionDiagnostic[]
    basesExpressions?: BasesExpressions
  }
}
