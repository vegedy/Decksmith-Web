<script setup lang="ts">
import type { ComparisonColumn, ComparisonRow } from '../types/visualization'
defineProps<{
  caption: string
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
}>()
</script>
<template>
  <table class="comparison-table visualization">
    <caption>{{ caption }}</caption>
    <thead>
      <tr>
        <th scope="col">Item</th>
        <th v-for="column in columns" :key="column.key" scope="col">
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.label">
        <th scope="row">{{ row.label }}</th>
        <td v-for="column in columns" :key="column.key">
          {{ row.values[column.key] ?? '—' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
