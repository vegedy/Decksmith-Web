<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  author: string
  institution?: string
  date: string
}>()
</script>
<template>
  <header class="title-content">
    <p v-if="institution" class="eyebrow">{{ institution }}</p>
    <h1>{{ title }}</h1>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    <div class="title-meta">
      <span>{{ author }}</span>
      <time :datetime="date">{{ date }}</time>
    </div>
    <slot name="hero" />
    <slot />
  </header>
</template>
