<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useInteraction } from '../composables/interaction'
const props = withDefaults(
  defineProps<{
    before: string
    after: string
    beforeAlt: string
    afterAlt: string
    beforeLabel?: string
    afterLabel?: string
    caption: string
    initial?: number
    static?: boolean
  }>(),
  { beforeLabel: 'Before', afterLabel: 'After', initial: 50, static: false },
)
const start = () => Math.max(0, Math.min(100, props.initial))
const position = ref(start())
const reset = () => {
  position.value = start()
}
const { isPrintMode } = useInteraction(reset)
const final = computed(() => props.static || isPrintMode.value)
const id = useId()
const url = (src: string) =>
  `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`
</script>
<template>
  <figure
    class="visualization image-compare"
    :class="{ 'compare-static': final }"
  >
    <figcaption>{{ caption }}</figcaption>
    <div class="compare-images">
      <div class="compare-before">
        <img :src="url(before)" :alt="beforeAlt" />
        <span>{{ beforeLabel }}</span>
      </div>
      <div
        class="compare-after"
        :style="final ? undefined : { clipPath: `inset(0 0 0 ${position}%)` }"
      >
        <img :src="url(after)" :alt="afterAlt" />
        <span>{{ afterLabel }}</span>
      </div>
      <div
        v-if="!final"
        class="compare-divider"
        :style="{ left: `${position}%` }"
      />
    </div>
    <div v-if="!final" class="interaction-controls">
      <label :for="id">
        {{ beforeLabel }} / {{ afterLabel }} — {{ position }}%
      </label>
      <input
        :id="id"
        v-model.number="position"
        type="range"
        min="0"
        max="100"
        step="1"
        @keydown.stop
      />
      <button type="button" @click.stop="reset">Reset comparison</button>
    </div>
  </figure>
</template>
