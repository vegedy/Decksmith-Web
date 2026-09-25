<script setup lang="ts">
import Cite from './Cite.vue'
defineProps<{ term: string; definition: string; source?: string }>()
</script>
<template>
  <span class="glossary">
    <dfn tabindex="0" :title="definition">{{ term }}</dfn>
    <span class="glossary-definition">
      — {{ definition }}
      <Cite v-if="source" :id="source" />
    </span>
  </span>
</template>
