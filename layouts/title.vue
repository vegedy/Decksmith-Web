<script setup lang="ts">
import DeckFrame from '../components/DeckFrame.vue'
import TitleSlide from '../components/TitleSlide.vue'
import deck from '../deck.config'
</script>
<template>
  <DeckFrame class="layout-title">
    <TitleSlide v-bind="deck.meta">
      <slot />
      <template #hero><slot name="hero" /></template>
    </TitleSlide>
  </DeckFrame>
</template>
