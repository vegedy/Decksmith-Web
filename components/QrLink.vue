<script setup lang="ts">
import { computed } from 'vue'
import { qrMatrix } from '../lib/qr'
const props = defineProps<{ href: string; label: string }>()
const code = computed(() => qrMatrix(props.href))
</script>
<template>
  <figure class="visualization qr-link">
    <svg
      :viewBox="`0 0 ${code.size} ${code.size}`"
      role="img"
      :aria-label="`QR code: ${label}`"
      shape-rendering="crispEdges"
    >
      <rect width="100%" height="100%" fill="white" />
      <path :d="code.path" fill="black" />
    </svg>
    <figcaption>
      <a :href="code.href">{{ label }}</a>
      <span class="visual-detail">{{ code.href }}</span>
    </figcaption>
  </figure>
</template>
