<template>
  <div
    v-if="url"
    class="message-box bg-white flex flex-col items-end text-slate-700"
  >
    <div class="p-2 rounded-full bg-slate-300 w-9 h-9">
      <DocumentIcon class="w-5 h-5" />
    </div>
    <div class="text-sm truncate min-w-0 w-full underline">
      {{ name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import DocumentIcon from '@/components/Icons/Document.vue'

const $props = withDefaults(
  defineProps<{
    /**đường link ảnh */
    url?: string
    /**tên của file */
    name?: string
  }>(),
  {}
)
</script>
