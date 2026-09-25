import { scanResources } from './resources.ts'
scanResources()
console.log(
  'No external runtime resource declarations found; hyperlinks remain allowed.',
)
