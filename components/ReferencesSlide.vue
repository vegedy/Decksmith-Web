<script setup lang="ts">
import { computed } from 'vue'
import { manifest, reference } from '../lib/science'
const props = withDefaults(
  defineProps<{
    kind?: 'literature' | 'assets' | 'all'
    offset?: number
    limit?: number
  }>(),
  { kind: 'literature', offset: 0, limit: undefined },
)
const entries = computed(() =>
  [
    ...new Set(
      props.kind === 'all'
        ? [...manifest.used, ...manifest.assets]
        : props.kind === 'assets'
          ? manifest.assets
          : manifest.used,
    ),
  ]
    .slice(
      props.offset,
      props.limit === undefined ? undefined : props.offset + props.limit,
    )
    .map(reference),
)
</script>
<template>
  <ol class="references-list" :start="offset + 1">
    <li
      v-for="entry in entries"
      :key="entry.id"
      :data-reference="entry.id"
      :value="
        [...new Set([...manifest.used, ...manifest.assets])].indexOf(entry.id) +
        1
      "
    >
      <div>
        {{ entry.authors?.join(', ') }} ({{ entry.year ?? 'n.d.' }}).
        <strong>{{ entry.title }}</strong>
        .
      </div>
      <div v-if="entry.containerTitle || entry.publisher">
        {{ entry.containerTitle }} {{ entry.publisher }}
      </div>
      <div v-if="entry.doi">
        DOI:
        <a :href="`https://doi.org/${entry.doi}`">{{ entry.doi }}</a>
      </div>
      <div v-if="entry.url">
        URL:
        <a :href="entry.url">{{ entry.url }}</a>
      </div>
      <div v-if="entry.accessedAt || entry.license">
        <span v-if="entry.accessedAt">Accessed {{ entry.accessedAt }}.</span>
        <span v-if="entry.license" class="reference-license">
          License: {{ entry.license }}.
        </span>
      </div>
    </li>
  </ol>
</template>
