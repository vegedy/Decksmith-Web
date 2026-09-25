<script setup lang="ts">
import type { DiagramStep } from '../types/visualization'
defineProps<{ label: string; steps: DiagramStep[] }>()
</script>
<template>
  <figure class="visualization pipeline">
    <figcaption>{{ label }}</figcaption>
    <ol>
      <li v-for="(step, index) in steps" :key="step.id">
        <span class="step-number">{{ index + 1 }}</span>
        <strong>{{ step.label }}</strong>
        <span v-if="step.detail" class="visual-detail">{{ step.detail }}</span>
      </li>
    </ol>
  </figure>
</template>
