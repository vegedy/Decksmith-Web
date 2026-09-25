<script setup lang="ts">
import DeckFrame from '../components/DeckFrame.vue'
import AppendixMarker from '../components/AppendixMarker.vue'
</script>
<template>
  <DeckFrame>
    <AppendixMarker />
    <slot />
  </DeckFrame>
</template>
