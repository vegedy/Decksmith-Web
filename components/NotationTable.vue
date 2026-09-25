<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'
import type { NotationEntry } from '../types/science'
const props = defineProps<{ entries: NotationEntry[]; caption?: string }>()
const rows = computed(() =>
  props.entries.map((entry) => ({
    ...entry,
    html: katex.renderToString(entry.symbol, {
      throwOnError: true,
      trust: false,
      output: 'htmlAndMathml',
    }),
  })),
)
</script>
<template>
  <table class="notation-table">
    <caption v-if="caption">{{ caption }}</caption>
    <thead>
      <tr>
        <th scope="col">Symbol</th>
        <th scope="col">Meaning</th>
        <th v-if="entries.some((e) => e.domain)" scope="col">Domain / type</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.symbol">
        <!-- KaTeX produces trusted markup with trust:false. -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <td v-html="row.html" />
        <td>{{ row.meaning }}</td>
        <td v-if="entries.some((e) => e.domain)">{{ row.domain }}</td>
      </tr>
    </tbody>
  </table>
</template>
