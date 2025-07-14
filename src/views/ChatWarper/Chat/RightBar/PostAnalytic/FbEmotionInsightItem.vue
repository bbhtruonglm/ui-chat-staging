<template>
  <div class="flex flex-col gap-1 items-center hover:brightness-90">
    <div class="p-1 rounded-lg bg-slate-200">
      <component
        :is="icon"
        class="size-5"
      />
    </div>
    <div class="text-xs text-blue-700 font-semibold">
      {{ $format.numberToString(amount, true) }}
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
    /**số lượng */
    amount?: number
  }>(),
  {}
)
</script>
