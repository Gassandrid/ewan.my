/** @jsxImportSource react */
import { createElement, useEffect, type ComponentType } from "react"
import { hydrateRoot } from "react-dom/client"
import { PageContext, type PageProps } from "./api"

export function mountPage(
  root: HTMLElement,
  Page: ComponentType<PageProps>,
  props: PageProps & { basePath: string },
) {
  function Ready() {
    useEffect(() => {
      root.dataset.pageReady = "true"
    }, [])
    return createElement(Page, props)
  }
  const app = hydrateRoot(
    root,
    <PageContext.Provider value={{ basePath: props.basePath }}>
      <Ready />
    </PageContext.Provider>,
    {
      identifierPrefix: root.dataset.pagePrefix,
      onRecoverableError: (error) => console.error("[React page hydration]", error),
    },
  )
  return () => app.unmount()
}
