<script setup lang="ts">
withDefaults(defineProps<{ ratio?: 'equal' | 'wide-left' | 'wide-right' }>(), {
  ratio: 'equal',
})
</script>
<template>
  <div class="two-column" :data-ratio="ratio">
    <div><slot /></div>
    <div><slot name="right" /></div>
  </div>
</template>
