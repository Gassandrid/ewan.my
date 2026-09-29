/** @jsxImportSource react */
import { createContext, useContext, type ReactNode, type AnchorHTMLAttributes } from "react"

export interface PageDefinition {
  slug: string
  title: string
  description: string
  /** Additional frontmatter for note properties and other Quartz consumers. */
  properties?: Record<string, unknown>
  tags?: string[]
  aliases?: string[]
  date: string
  updated?: string
  draft?: boolean
  unlisted?: boolean
  frame?: "default" | "full-width"
  cssclasses?: string[]
  /** False for a static React composition or a body owned by an existing imperative renderer. */
  hydrate?: boolean
  /** Explicit migration only: relative Markdown paths whose routes this page replaces. */
  replaces?: string[]
}
export interface PageProps<T = Record<string, never>> {
  page: PageDefinition
  data: T
}
/** Build-only input. Paths are relative to the website repository and watched in dev. */
export interface PageDataContext {
  readText(file: string): Promise<string>
}
export const definePage = <T extends PageDefinition>(page: T): T => page
export const PageContext = createContext({ basePath: "/" })
export function pagePath(basePath: string, slug: string) {
  return basePath + slug.split("/").map(encodeURIComponent).join("/")
}
export function PageLink({
  to,
  children,
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: string; children: ReactNode }) {
  const { basePath } = useContext(PageContext)
  const [slug, anchor] = to.split("#", 2)
  return (
    <a
      {...props}
      href={pagePath(basePath, slug) + (anchor ? "#" + encodeURIComponent(anchor) : "")}
      className={["internal", "internal-link", props.className].filter(Boolean).join(" ")}
      data-slug={slug}
    >
      {children}
    </a>
  )
}
/** Stable authored anchors are shared by SSR, hydration, links and the Quartz TOC. */
export function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  )
}
