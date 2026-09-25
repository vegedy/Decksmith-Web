<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { useMotion } from '@vueuse/motion'
import { useInteraction } from '../composables/interaction'
import { motionFrom } from '../lib/motion'
import type { MotionPreset } from '../types/visualization'
const props = withDefaults(
  defineProps<{
    at?: number
    motion?: MotionPreset
    static?: boolean
    controls?: boolean
  }>(),
  { at: 1, motion: 'fade', static: false, controls: true },
)
const { $clicks, $clicksContext } = useSlideContext()
const { isPrintMode, reducedMotion } = useInteraction(() => {})
const target = ref<HTMLElement>()
const active = computed(
  () => props.static || isPrintMode.value || $clicks.value >= props.at,
)
const instant = computed(
  () => reducedMotion.value || props.static || isPrintMode.value,
)
const controller = useMotion(target, {}, { lifeCycleHooks: false })
function animate() {
  Array.from(target.value?.children ?? []).forEach((child, index) => {
    if (child instanceof HTMLElement || child instanceof SVGElement)
      child.style.setProperty('--motion-index', String(index))
  })
  controller.stop()
  const end = { opacity: 1, x: 0, y: 0, scale: 1 }
  controller.set(active.value || instant.value ? end : motionFrom[props.motion])
  if (active.value && !instant.value) {
    controller.set(motionFrom[props.motion])
    const duration =
      parseFloat(
        getComputedStyle(target.value!).getPropertyValue('--duration-base'),
      ) || 260
    void controller.apply({ ...end, transition: { duration } })
  }
}
onMounted(animate)
watch([active, instant, () => props.motion], () => {
  if (target.value) animate()
})
function reset() {
  $clicks.value = $clicksContext.clicksStart
}
</script>
<template>
  <div
    class="interactive-reveal"
    :data-motion="props.motion"
    :data-active="active"
    :data-instant="instant"
  >
    <div
      v-click="props.static ? false : at"
      class="reveal-gate"
      :inert="!active"
      :aria-hidden="!active"
    >
      <div ref="target" class="motion-target"><slot /></div>
    </div>
    <button
      v-if="controls && !props.static && !isPrintMode"
      type="button"
      class="interaction-controls"
      @click.stop="reset"
    >
      Reset steps
    </button>
  </div>
</template>
