<script setup lang="ts">
import { computed } from 'vue'
import { citation, reference } from '../lib/science'
import { referenceLink } from '../lib/citations'
import type { CitationStyle } from '../types/science'
const props = defineProps<{ id: string; citationStyle?: CitationStyle }>()
const entry = computed(() => reference(props.id))
</script>
<template>
  <a v-if="referenceLink(entry)" class="citation" :href="referenceLink(entry)">
    {{ citation(id, citationStyle) }}
  </a>
  <span v-else class="citation">{{ citation(id, citationStyle) }}</span>
</template>
