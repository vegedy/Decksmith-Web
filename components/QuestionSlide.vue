<script setup lang="ts">
withDefaults(defineProps<{ question?: string; prompt?: string }>(), {
  question: 'Questions?',
  prompt: undefined,
})
</script>
<template>
  <section class="question-slide">
    <h1>{{ question }}</h1>
    <p v-if="prompt" class="subtitle">{{ prompt }}</p>
    <slot />
  </section>
</template>
