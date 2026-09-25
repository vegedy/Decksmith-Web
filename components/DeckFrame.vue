<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import SourceFooter from './SourceFooter.vue'
import deck from '../deck.config'
const { $slidev, $page, $frontmatter } = useSlideContext()
const number = computed(() => $page.value)
const total = computed(() => $slidev.nav.total)
</script>
<template>
  <div class="slidev-layout deck-frame" :data-theme="deck.display.defaultTheme">
    <main class="deck-content">
      <slot />
      <SourceFooter
        v-if="$frontmatter.citations?.length"
        :ids="$frontmatter.citations.join(',')"
      />
    </main>
    <footer class="deck-footer">
      <span>{{ deck.display.footer }}</span>
      <span v-if="deck.display.showSlideNumbers">
        {{ number }} / {{ total }}
      </span>
    </footer>
    <div
      v-if="deck.display.showProgress"
      class="deck-progress"
      aria-hidden="true"
      :style="{ width: `${(number / total) * 100}%` }"
    />
  </div>
</template>
