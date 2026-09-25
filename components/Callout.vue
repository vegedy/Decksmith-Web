<script setup lang="ts">
withDefaults(
  defineProps<{
    kind?: 'definition' | 'assumption' | 'limitation' | 'risk' | 'insight'
    title?: string
  }>(),
  { kind: 'insight', title: undefined },
)
</script>
<template>
  <aside class="callout" :data-kind="kind">
    <strong class="callout-title">{{ title ?? kind }}</strong>
    <div><slot /></div>
  </aside>
</template>
