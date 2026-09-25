<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    labels: string[]
    values: number[][]
    caption: string
    details?: boolean
  }>(),
  { details: true },
)
const maximum = computed(() => {
  if (
    !props.labels.length ||
    props.values.length !== props.labels.length ||
    props.values.some(
      (row) =>
        row.length !== props.labels.length ||
        row.some((v) => !Number.isFinite(v) || v < 0),
    )
  )
    throw new Error(
      'ConfusionMatrix needs a square, finite, non-negative matrix matching labels',
    )
  return Math.max(1, ...props.values.flat())
})
</script>
<template>
  <figure class="visualization confusion-matrix">
    <table>
      <caption>{{ caption }} · Rows: actual; columns: predicted</caption>
      <thead>
        <tr>
          <th scope="col">Actual ↓ / Predicted →</th>
          <th v-for="label in labels" :key="label" scope="col">{{ label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ri) in values" :key="ri">
          <th scope="row">{{ labels[ri] }}</th>
          <td
            v-for="(value, ci) in row"
            :key="ci"
            :style="{
              backgroundColor: `color-mix(in srgb, var(--color-primary) ${8 + (value / maximum) * 22}%, var(--color-canvas))`,
            }"
            :title="
              details
                ? `Actual ${labels[ri]}, predicted ${labels[ci]}: ${value}`
                : undefined
            "
          >
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="visual-detail">
      Shade:
      <span class="matrix-scale" aria-hidden="true" />
      0 → {{ maximum }} observations. Diagonal = correct predictions.
    </p>
  </figure>
</template>
