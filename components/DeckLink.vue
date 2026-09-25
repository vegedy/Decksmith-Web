<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
defineProps<{ target: 'main' | 'appendix' }>()
const { isPrintMode } = useNav()
const isDev = import.meta.env.DEV
const main = computed(() => (isDev ? 'http://localhost:3030/' : '../'))
const appendix = computed(() =>
  isDev ? 'http://localhost:3031/' : './appendix/',
)
</script>
<template>
  <span v-if="isPrintMode"><slot /></span>
  <a
    v-else
    :data-deck-target="target"
    :href="target === 'main' ? main : appendix"
  >
    <slot />
  </a>
</template>
