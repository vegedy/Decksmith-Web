<script setup lang="ts">
defineProps<{ title: string; number?: string | number; question?: string }>()
</script>
<template>
  <header class="section-content">
    <p v-if="number !== undefined" class="eyebrow">Section {{ number }}</p>
    <h1>{{ title }}</h1>
    <p v-if="question" class="subtitle">{{ question }}</p>
    <slot />
  </header>
</template>
