<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Takeaway' })
</script>
<template>
  <aside class="takeaway">
    <strong>{{ label }}</strong>
    <div><slot /></div>
  </aside>
</template>
