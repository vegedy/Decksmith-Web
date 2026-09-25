<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), {
  label: 'Appendix · Optional detail',
})
</script>
<template>
  <p class="eyebrow appendix-marker">{{ label }}</p>
</template>
