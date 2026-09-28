<script setup lang="ts">
import type { DiagramStep } from '../types/visualization'
defineProps<{ label: string; steps: DiagramStep[]; stepwise?: boolean }>()
</script>
<template>
  <figure class="visualization pipeline">
    <figcaption>{{ label }}</figcaption>
    <ol>
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        v-click="stepwise && index > 0 ? undefined : false"
      >
        <span class="step-number">{{ index + 1 }}</span>
        <strong>{{ step.label }}</strong>
        <span v-if="step.detail" class="visual-detail">{{ step.detail }}</span>
      </li>
    </ol>
  </figure>
</template>
