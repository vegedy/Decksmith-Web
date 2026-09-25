<script setup lang="ts">
import { manifest } from '../lib/science'
withDefaults(defineProps<{ id: string; label?: string }>(), { label: 'Eq.' })
</script>
<template>
  <span class="equation-ref">{{ label }} ({{ manifest.equations[id] }})</span>
</template>
