<script setup lang="ts">
import type { DiagramStep } from '../types/visualization'
import InteractiveReveal from './InteractiveReveal.vue'
withDefaults(
  defineProps<{
    label: string
    steps: DiagramStep[]
    startAt?: number
    sequential?: boolean
  }>(),
  { startAt: 1, sequential: false },
)
</script>
<template>
  <section class="visualization process-steps" :aria-label="label">
    <h2>{{ label }}</h2>
    <ol>
      <li v-for="(step, index) in steps" :key="step.id">
        <InteractiveReveal
          :at="startAt + index"
          :static="!sequential"
          motion="slide-up"
          :controls="false"
        >
          <strong>{{ step.label }}</strong>
          <span v-if="step.detail">— {{ step.detail }}</span>
        </InteractiveReveal>
      </li>
    </ol>
  </section>
</template>
