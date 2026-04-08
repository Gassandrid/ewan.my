import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"
import { classNames } from "../util/lang"

const BasesNav: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const root = pathToRoot(fileData.slug!)
  const baseSlug = fileData.basesMetadata?.baseSlug

  // Build breadcrumb: Home > base name
  const baseName = baseSlug
    ? baseSlug.split("/").pop()?.replace(".base", "") ?? "Base"
    : "Base"

  return (
    <nav class={classNames(displayClass, "bases-nav")} aria-label="Bases navigation">
      <a href={root} class="bases-nav-home" title="Home">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </a>
      <span class="bases-nav-sep" aria-hidden="true">/</span>
      <span class="bases-nav-current">{baseName}</span>
    </nav>
  )
}

BasesNav.css = `
.bases-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0 0.25rem;
  font-size: 0.875rem;
  color: var(--gray);
}

.bases-nav-home {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--secondary);
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: var(--tertiary);
    background: none !important;
  }

  svg {
    flex-shrink: 0;
  }
}

.bases-nav-sep {
  color: var(--lightgray);
  user-select: none;
}

.bases-nav-current {
  color: var(--darkgray);
  font-weight: 500;
}
`

export default (() => BasesNav) satisfies QuartzComponentConstructor
