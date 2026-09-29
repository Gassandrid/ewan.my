/** @jsxImportSource react */
import { definePage } from "../quartz/custom-pages/api"
import { morrisLecarMarkup } from "./morris-lecar.markup"
export const page = definePage({
  slug: "pages/morris-lecar",
  title: "Morris-Lecar Phase Plane",
  description:
    "An experiment in using coding agents to support learning through interactive visualization of the Morris–Lecar model, its Jacobian, and its bifurcations.",
  date: "2026-03-28",
  updated: "2026-09-28",
  tags: ["comp-neuro/models", "math/chaos/dynamics"],
  cssclasses: ["morris-lecar-page"],
  frame: "full-width",
  hydrate: false,
})
export default function MorrisLecar() {
  return (
    <div className="ml-wrap" id="ml-app" dangerouslySetInnerHTML={{ __html: morrisLecarMarkup }} />
  )
}
