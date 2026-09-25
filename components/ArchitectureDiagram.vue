<script setup lang="ts">
import { computed, useId } from 'vue'
import type {
  ArchitectureNode,
  ArchitectureEdge,
  TrustBoundary,
} from '../types/visualization'
const props = withDefaults(
  defineProps<{
    label: string
    nodes: ArchitectureNode[]
    edges: ArchitectureEdge[]
    boundaries?: TrustBoundary[]
    legend?: string
    width?: number
    height?: number
  }>(),
  { boundaries: () => [], width: 800, height: 260, legend: undefined },
)
const marker = `arrow-${useId()}`
const flows = computed(() =>
  props.edges.map((edge) => {
    const from = props.nodes.find((node) => node.id === edge.from)
    const to = props.nodes.find((node) => node.id === edge.to)
    if (!from || !to)
      throw new Error(`Unknown architecture edge: ${edge.from} → ${edge.to}`)
    const dx = to.x - from.x,
      dy = to.y - from.y
    const factor = Math.max(Math.abs(dx) / 120, Math.abs(dy) / 46, 1)
    return {
      ...edge,
      x1: from.x + dx / factor / 2,
      y1: from.y + dy / factor / 2,
      x2: to.x - dx / factor / 2,
      y2: to.y - dy / factor / 2,
    }
  }),
)
</script>
<template>
  <figure class="visualization architecture">
    <figcaption>{{ label }}</figcaption>
    <svg :viewBox="`0 0 ${width} ${height}`" role="img" :aria-label="label">
      <defs>
        <marker
          :id="marker"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <g
        v-for="boundary in boundaries"
        :key="boundary.id"
        class="trust-boundary"
      >
        <rect
          :x="boundary.x"
          :y="boundary.y"
          :width="boundary.width"
          :height="boundary.height"
          rx="8"
        />
        <text :x="boundary.x + 12" :y="boundary.y + 26">
          {{ boundary.label }}
        </text>
      </g>
      <g v-for="(flow, index) in flows" :key="index" class="data-flow">
        <path
          :d="`M ${flow.x1} ${flow.y1} L ${flow.x2} ${flow.y2}`"
          :marker-end="`url(#${marker})`"
          pathLength="1"
        />
        <text
          :x="(flow.x1 + flow.x2) / 2"
          :y="(flow.y1 + flow.y2) / 2 - 12"
          text-anchor="middle"
        >
          {{ flow.label }}
        </text>
      </g>
      <g v-for="node in nodes" :key="node.id" class="architecture-node">
        <title>{{ node.detail ?? node.label }}</title>
        <rect
          :x="node.x - 60"
          :y="node.y - 23"
          width="120"
          height="46"
          rx="6"
        />
        <text :x="node.x" :y="node.y + 6" text-anchor="middle">
          {{ node.label }}
        </text>
      </g>
    </svg>
    <p v-if="legend" class="visual-detail">{{ legend }}</p>
  </figure>
</template>
