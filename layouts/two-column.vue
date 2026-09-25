<script setup lang="ts">
import DeckFrame from '../components/DeckFrame.vue'
import TwoColumn from '../components/TwoColumn.vue'
withDefaults(defineProps<{ ratio?: 'equal' | 'wide-left' | 'wide-right' }>(), {
  ratio: 'equal',
})
</script>
<template>
  <DeckFrame>
    <TwoColumn :ratio="ratio">
      <slot />
      <template #right><slot name="right" /></template>
    </TwoColumn>
  </DeckFrame>
</template>
