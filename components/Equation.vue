<script setup lang="ts">
import { manifest } from '../lib/science'
withDefaults(
  defineProps<{
    id: string
    label?: string
    explanation?: string
    compact?: boolean
    numbered?: boolean
  }>(),
  { numbered: true, label: undefined, explanation: undefined },
)
</script>
<template>
  <figure :id="`equation-${id}`" class="equation" :class="{ compact }">
    <figcaption v-if="label">{{ label }}</figcaption>
    <div class="equation-row">
      <div class="equation-body"><slot /></div>
      <span v-if="numbered" class="equation-number">
        ({{ manifest.equations[id] }})
      </span>
    </div>
    <div v-if="explanation" class="equation-explanation">{{ explanation }}</div>
  </figure>
</template>
