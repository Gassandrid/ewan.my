import type { PageDataContext } from "../quartz/custom-pages/api"
export default async function loadData({ readText }: PageDataContext) {
  const hrv = JSON.parse(await readText("quartz/static/data/demo-hrv.json"))
  const csv = (await readText("quartz/static/data/demo-extraction.csv")).trim().split(/\r?\n/)
  const keys = csv.shift()!.split(",")
  const extraction = csv.map((line) =>
    Object.fromEntries(
      line.split(",").map((value, i) => [keys[i], Number.isFinite(+value) ? +value : value]),
    ),
  )
  return { hrv, extraction }
}
