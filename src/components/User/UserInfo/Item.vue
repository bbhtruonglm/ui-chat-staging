<template>
  <div class="flex items-center gap-3 py-1.5">
    <div class="min-w-0 flex-grow flex items-center gap-3">
      <div
        class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
      >
        <component
          :is="icon"
          class="w-5 h-5"
        />
      </div>
      <div>
        <div class="font-medium text-sm">
          {{ title }}
        </div>
        <div class="font-medium text-xs text-gray-500">
          {{ description }}
        </div>
      </div>
    </div>
    <slot />
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
    /** Mô tả */
    description?: string
  }>(),
  {}
)
</script>
