import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'
/** Local UI is reset on every native slide transition; no global component state. */
export function useInteraction(reset: () => void) {
  const { isPrintMode } = useNav()
  const { $slidev } = useSlideContext()
  watch(() => $slidev.nav.currentPage, reset)
  const reducedMotion = ref(false)
  let media: MediaQueryList | undefined
  const update = () => {
    reducedMotion.value = media?.matches ?? false
  }
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    media.addEventListener('change', update)
  })
  onUnmounted(() => media?.removeEventListener('change', update))
  return { isPrintMode, reducedMotion }
}
