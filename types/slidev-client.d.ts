// Slidev ships raw client TypeScript that relies on its private build globals.
// Keep a narrow declaration boundary for the public API used by this template.
// Runtime shape is verified by the foundation browser smoke test.
import type { ComputedRef, Ref } from 'vue'
export function useSlideContext(): {
  $clicks: Ref<number>
  $clicksContext: { clicksStart: number }
  $page: ComputedRef<number>
  $frontmatter: { citations?: string[] }
  $slidev: { nav: { total: number; currentPage: number } }
}

export function useNav(): { isPrintMode: ComputedRef<boolean> }
