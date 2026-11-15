// Checks showcase.yaml: run `bun scripts/check.ts`.
import { readdirSync, statSync } from "node:fs"

const maxImageBytes = 512 * 1024
const fields = new Set(["name", "description", "url", "author", "mode", "image"])
const problems: string[] = []

const apps = Bun.YAML.parse(await Bun.file("showcase.yaml").text())
if (!Array.isArray(apps)) throw new Error("showcase.yaml must be a list of apps")

const urls = new Set<string>()
const images = new Set<string>()
apps.forEach((app: Record<string, unknown>, i: number) => {
  const where = `entry ${i + 1}${typeof app?.name === "string" ? ` (${app.name})` : ""}`
  if (!app || typeof app !== "object") return problems.push(`${where}: not a mapping`)
  for (const key of Object.keys(app)) if (!fields.has(key)) problems.push(`${where}: unknown field "${key}"`)
  for (const key of ["name", "description", "url"])
    if (typeof app[key] !== "string" || !(app[key] as string).trim()) problems.push(`${where}: "${key}" is required`)
  for (const key of ["author", "image"])
    if (key in app && typeof app[key] !== "string") problems.push(`${where}: "${key}" must be a string`)
  if (typeof app.url === "string") {
    if (!/^https:\/\/[^\s]+$/.test(app.url)) problems.push(`${where}: "url" must be an https URL`)
    if (urls.has(app.url)) problems.push(`${where}: "${app.url}" is listed twice`)
    urls.add(app.url)
  }
  if ("mode" in app && app.mode !== "native" && app.mode !== "web") problems.push(`${where}: "mode" must be native or web`)
  if (typeof app.image === "string") {
    if (!/^images\/[a-z0-9][a-z0-9._-]*\.(jpg|jpeg|png|webp|svg)$/.test(app.image))
      problems.push(`${where}: "image" must be a lowercase .jpg, .png, .webp or .svg file in images/`)
    else {
      try {
        const size = statSync(app.image).size
        if (size > maxImageBytes) problems.push(`${where}: ${app.image} is ${Math.round(size / 1024)} KB; keep it under 300 KB`)
      } catch {
        problems.push(`${where}: ${app.image} does not exist`)
      }
    }
    images.add(app.image)
  }
})
for (const file of readdirSync("images"))
  if (!images.has(`images/${file}`)) problems.push(`images/${file} is not used by any entry`)

if (problems.length) {
  console.error(problems.join("\n"))
  process.exit(1)
}
console.log(`${apps.length} apps, all good`)
