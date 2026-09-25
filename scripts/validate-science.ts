import { scientificManifest } from './science.ts'
const result = await scientificManifest()
console.log(
  `Validated ${result.used.length} literature sources, ${result.assets.length} asset sources and ${Object.keys(result.equations).length} equations; local assets resolved.`,
)
