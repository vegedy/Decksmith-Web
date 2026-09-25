// Slidev ships raw client TypeScript that relies on its private build globals.
// Keep a narrow declaration boundary for the public API used by this template.
// Runtime shape is verified by the foundation browser smoke test.
import type { ComputedRef } from 'vue'
export function useSlideContext(): {
  $page: ComputedRef<number>
  $slidev: { nav: { total: number } }
}

export function useNav(): { isPrintMode: ComputedRef<boolean> }
