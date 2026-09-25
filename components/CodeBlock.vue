<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
const props = withDefaults(
  defineProps<{
    filename?: string
    language?: string
    lineNumbers?: boolean
    focus?: number[]
  }>(),
  {
    filename: undefined,
    language: undefined,
    lineNumbers: true,
    focus: () => [],
  },
)
const root = ref<HTMLElement>()
function markLines() {
  root.value?.querySelectorAll('pre code .line').forEach((line, index) => {
    line.classList.toggle('code-focused', props.focus.includes(index + 1))
  })
}
onMounted(markLines)
onUpdated(markLines)
</script>
<template>
  <figure
    ref="root"
    class="scientific-code"
    :class="{ 'with-line-numbers': lineNumbers, 'with-focus': focus.length }"
  >
    <figcaption v-if="filename || language">
      {{ filename }}
      <span>{{ language }}</span>
    </figcaption>
    <slot />
  </figure>
</template>
