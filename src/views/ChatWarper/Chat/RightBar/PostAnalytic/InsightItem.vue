<template>
  <div
    class="flex gap-2 items-center py-1.5 px-2 rounded-lg bg-slate-100 hover:brightness-90"
  >
    <div class="p-1 rounded-lg bg-slate-200">
      <component
        :is="icon"
        class="size-5"
      />
    </div>
    <div class="text-xs">
      <div class="font-medium">{{ title }}</div>
      <div class="text-blue-700 font-semibold">
        {{ $format.numberToString(amount, true) }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Format } from '@/utils/helper/Format'
import { container } from 'tsyringe'

import type { Component } from 'vue'

const $format = container.resolve(Format)

const $props = withDefaults(
  defineProps<{
    icon: Component
    /**tiêu đề */
    title: string
    /**số lượng */
    amount?: number
  }>(),
  {}
)
</script>
