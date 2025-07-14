<template>
  <div v-if="count">
    <div
      :class="{
        'bg-slate-100': is_active,
      }"
      class="flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer hover:bg-slate-100 w-max"
    >
      <component
        :is="icon"
        class="w-4 h-4 text-slate-700"
      />
      <div class="font-medium text-xs">{{ title }}</div>
      <div
        :class="
          is_active ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
        "
        class="font-medium text-xs px-1 rounded"
      >
        {{ count }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Component } from 'vue'

const $props = withDefaults(
  defineProps<{
    /** Icon vue */
    icon: Component
    /** Tiêu đề */
    title: string
    /** Số lượng trang */
    count?: number
    /** Có active không */
    is_active?: boolean
  }>(),
  {}
)
</script>
