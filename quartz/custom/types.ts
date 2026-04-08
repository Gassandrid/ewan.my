import { FullSlug } from "../util/path"

export interface CustomPageDef {
  slug: FullSlug
  title: string
  tags?: string[]
  description?: string
  date?: Date
  fullWidth?: boolean
  body: () => any
}
