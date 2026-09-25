<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChartSeries, ChartType, ChartPoint } from '../types/visualization'
import { useInteraction } from '../composables/interaction'
import { chartDomain } from '../lib/chart'
const props = withDefaults(
  defineProps<{
    type: ChartType
    title: string
    series: ChartSeries[]
    xLabel?: string
    yLabel?: string
    details?: boolean
  }>(),
  { details: false, xLabel: undefined, yLabel: undefined },
)
const detailPanel = ref<HTMLDetailsElement>()
useInteraction(() => {
  if (detailPanel.value) detailPanel.value.open = false
})
const domain = computed(() => chartDomain(props.series, props.type))
const x = (value: number) =>
  75 +
  ((value - domain.value.minX) / (domain.value.maxX - domain.value.minX)) * 550
const y = (value: number) =>
  215 -
  ((value - domain.value.minY) / (domain.value.maxY - domain.value.minY)) * 170
const all = computed(() => props.series.flatMap((s) => s.points))
const barWidth = computed(() => Math.min(42, 480 / all.value.length))
const barX = (si: number, pi: number) =>
  85 +
  ((props.series.slice(0, si).reduce((n, s) => n + s.points.length, 0) + pi) *
    550) /
    all.value.length
function polar(value: number, index: number, count: number) {
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2
  return { x: 350 + Math.cos(angle) * value, y: 145 + Math.sin(angle) * value }
}
const radarPoint = (p: ChartPoint, i: number, count: number) =>
  polar((p.y / domain.value.maxY) * 90, i, count)
const path = (points: ChartPoint[]) =>
  points
    .map((p, i) => {
      const r =
        props.type === 'radar'
          ? radarPoint(p, i, points.length)
          : { x: x(p.x), y: y(p.y) }
      return `${i ? 'L' : 'M'} ${r.x} ${r.y}`
    })
    .join(' ') + (props.type === 'radar' ? ' Z' : '')
</script>
<template>
  <figure class="visualization chart">
    <figcaption>{{ title }}</figcaption>
    <svg viewBox="0 0 700 290" role="img" :aria-label="`${title} (${type})`">
      <template v-if="type !== 'radar'">
        <path class="chart-axis" d="M 70 35 V 215" />
        <path class="chart-axis" :d="`M 70 ${y(0)} H 665`" />
        <text x="60" y="48" text-anchor="end">{{ domain.maxY }}</text>
        <text x="60" y="220" text-anchor="end">{{ domain.minY }}</text>
        <text x="75" y="20">{{ yLabel }}</text>
        <text x="350" y="283" text-anchor="middle">{{ xLabel }}</text>
        <template v-if="type !== 'bar'">
          <text x="75" y="247">{{ domain.minX }}</text>
          <text x="625" y="247" text-anchor="end">{{ domain.maxX }}</text>
        </template>
      </template>
      <template v-else>
        <g v-for="(point, index) in series[0]!.points" :key="index">
          <path
            class="chart-axis"
            :d="`M 350 145 L ${polar(90, index, series[0]!.points.length).x} ${polar(90, index, series[0]!.points.length).y}`"
          />
          <text
            :x="polar(115, index, series[0]!.points.length).x"
            :y="polar(115, index, series[0]!.points.length).y"
            :text-anchor="
              Math.abs(polar(115, index, series[0]!.points.length).x - 350) < 1
                ? 'middle'
                : polar(115, index, series[0]!.points.length).x > 350
                  ? 'start'
                  : 'end'
            "
          >
            {{ point.label }}
          </text>
        </g>
        <text x="20" y="280">Scale: 0–{{ domain.maxY }} {{ yLabel }}</text>
      </template>
      <g
        v-for="(item, si) in series"
        :key="item.name"
        :class="`chart-series series-${si % 4}`"
      >
        <path
          v-if="type === 'line' || type === 'radar'"
          :d="path(item.points)"
          :stroke-dasharray="si % 2 ? '7 4' : undefined"
          class="chart-line"
        />
        <g v-for="(point, pi) in item.points" :key="pi">
          <title v-if="details">
            {{ item.name }} · {{ point.label }}: {{ point.y
            }}{{ point.detail ? ` — ${point.detail}` : '' }}
          </title>
          <template v-if="type === 'bar'">
            <rect
              :x="barX(si, pi)"
              :y="Math.min(y(0), y(point.y))"
              :width="barWidth"
              :height="Math.abs(y(point.y) - y(0))"
            />
            <text
              :x="barX(si, pi) + barWidth / 2"
              :y="point.y >= 0 ? y(point.y) - 8 : y(point.y) + 20"
              text-anchor="middle"
            >
              {{ point.y }}
            </text>
            <text :x="barX(si, pi) + barWidth / 2" y="248" text-anchor="middle">
              {{ point.label }}
            </text>
          </template>
          <circle
            v-else
            :cx="
              type === 'radar'
                ? radarPoint(point, pi, item.points.length).x
                : x(point.x)
            "
            :cy="
              type === 'radar'
                ? radarPoint(point, pi, item.points.length).y
                : y(point.y)
            "
            :r="4 + (si % 3)"
          />
        </g>
      </g>
    </svg>
    <ul class="chart-legend">
      <li
        v-for="(item, index) in series"
        :key="item.name"
        :class="`series-${index % 4}`"
      >
        <span aria-hidden="true">{{ index % 2 ? '┄ ●' : '━ ●' }}</span>
        {{ item.name }}:
        <span v-if="type !== 'bar'">
          {{ item.points.map((p) => `${p.label} ${p.y}`).join(' · ') }}
        </span>
        <span v-else>{{ item.points.length }} values</span>
      </li>
    </ul>
    <details v-if="details" ref="detailPanel" class="chart-details">
      <summary>Data details</summary>
      <table>
        <caption>{{ title }} — exact values</caption>
        <thead>
          <tr>
            <th>Series</th>
            <th>Point</th>
            <th>x</th>
            <th>y</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in series" :key="item.name">
            <tr v-for="(point, i) in item.points" :key="i">
              <th>{{ item.name }}</th>
              <td>{{ point.label }}</td>
              <td>{{ point.x }}</td>
              <td>{{ point.y }}</td>
              <td>{{ point.detail ?? '—' }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </details>
  </figure>
</template>
