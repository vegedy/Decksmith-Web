<script setup lang="ts">
import { computed } from 'vue'
import deck from '../deck.config'
import Cite from './Cite.vue'
import type { CitationStyle } from '../types/science'
const props = defineProps<{ ids?: string; citationStyle?: CitationStyle }>()
const keys = computed(() => [
  ...new Set(props.ids?.split(/\s*,\s*/).filter(Boolean) ?? []),
])
</script>
<template>
  <aside
    v-if="deck.display.showSourceFooters"
    class="source-footer"
    aria-label="Sources"
  >
    <slot>
      <template v-for="(id, index) in keys" :key="id">
        <span v-if="index">;</span>
        <Cite :id="id" :citation-style="citationStyle" />
      </template>
    </slot>
  </aside>
</template>
