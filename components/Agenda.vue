<script setup lang="ts">
withDefaults(
  defineProps<{
    items: { title: string; description?: string }[]
    current?: number
    label?: string
  }>(),
  { current: 1, label: 'Agenda' },
)
</script>
<template>
  <nav class="agenda" :aria-label="label">
    <ol>
      <li
        v-for="(item, index) in items"
        :key="index"
        :aria-current="index + 1 === current ? 'step' : undefined"
      >
        <strong>{{ item.title }}</strong>
        <span v-if="index + 1 === current">— Current</span>
        <span v-else-if="index + 1 < current">— Completed</span>
        <div v-if="item.description" class="visual-detail">
          {{ item.description }}
        </div>
      </li>
    </ol>
  </nav>
</template>
