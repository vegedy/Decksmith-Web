<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  unit?: string
  interpretation: string
  trend?: string
}>()
</script>
<template>
  <figure class="metric-card visualization">
    <figcaption>{{ label }}</figcaption>
    <div class="metric-value">
      {{ value }}
      <small>{{ unit }}</small>
    </div>
    <p>{{ interpretation }}</p>
    <p v-if="trend" class="visual-detail">{{ trend }}</p>
  </figure>
</template>
