<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'
import { reference } from '../lib/science'
import Cite from './Cite.vue'
const props = defineProps<{
  src: string
  alt: string
  caption: string
  source?: string
  license?: string
  zoom?: boolean
}>()
const dialog = ref<HTMLDialogElement>()
const { isPrintMode } = useNav()
const { $slidev } = useSlideContext()
watch(
  () => $slidev.nav.currentPage,
  () => dialog.value?.close(),
)
const url = computed(
  () => `${import.meta.env.BASE_URL}${props.src.replace(/^\//, '')}`,
)
const licenseText = computed(
  () =>
    props.license ??
    (props.source ? reference(props.source).license : undefined),
)
</script>
<template>
  <figure class="scientific-figure">
    <img :src="url" :alt="alt" />
    <figcaption>
      {{ caption }}
      <Cite v-if="source" :id="source" />
      <span v-if="licenseText">· {{ licenseText }}</span>
    </figcaption>
    <button
      v-if="zoom && !isPrintMode"
      class="figure-zoom"
      type="button"
      @click="dialog?.showModal()"
    >
      Enlarge figure
    </button>
    <dialog
      v-if="zoom && !isPrintMode"
      ref="dialog"
      class="figure-dialog"
      :aria-label="caption"
      @click="dialog?.close()"
    >
      <button type="button" @click="dialog?.close()">Close figure</button>
      <img :src="url" :alt="alt" />
      <p>{{ caption }}</p>
    </dialog>
  </figure>
</template>
