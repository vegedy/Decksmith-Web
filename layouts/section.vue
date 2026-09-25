<script setup lang="ts">
import DeckFrame from '../components/DeckFrame.vue'
import SectionSlide from '../components/SectionSlide.vue'
defineProps<{
  frontmatter: { title: string }
  number?: string | number
  question?: string
}>()
</script>
<template>
  <DeckFrame class="layout-section">
    <SectionSlide
      :title="frontmatter.title"
      :number="number"
      :question="question"
    >
      <slot />
    </SectionSlide>
  </DeckFrame>
</template>
