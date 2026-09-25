import { defineKatexSetup } from '@slidev/types'
export default defineKatexSetup(() => ({
  throwOnError: true,
  trust: false,
  strict: 'error',
  output: 'htmlAndMathml',
}))
