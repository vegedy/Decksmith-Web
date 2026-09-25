<script setup lang="ts">
import type { TimelineEvent } from '../types/visualization'
defineProps<{ label: string; events: TimelineEvent[] }>()
</script>
<template>
  <figure class="visualization timeline">
    <figcaption>{{ label }}</figcaption>
    <ol>
      <li v-for="event in events" :key="event.id">
        <strong>{{ event.date }}</strong>
        <span>{{ event.label }}</span>
        <span v-if="event.detail" class="visual-detail">
          {{ event.detail }}
        </span>
      </li>
    </ol>
  </figure>
</template>
