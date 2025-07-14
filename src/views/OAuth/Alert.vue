<template>
  <div
    :class="{
      'border-red-600 bg-red-50 text-red-600': type === 'error',
      'border-green-600 bg-green-50 text-green-600': type === 'success',
    }"
    class="flex items-start gap-3 border rounded-lg px-4 py-3 text-sm"
  >
    <CheckBadgeIcon
      v-if="type === 'success'"
      class="w-5 h-5 flex-shrink-0"
    />
    <ExclamationCircleIcon
      v-if="type === 'error'"
      class="w-5 h-5 flex-shrink-0"
    />
    <div class="flex flex-col gap-1">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckBadgeIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid'

const $props = withDefaults(
  defineProps<{
    /**kiểu của alert này */
    type?: 'success' | 'error'
  }>(),
  { type: 'success' }
)
</script>
