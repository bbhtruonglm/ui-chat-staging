<template>
  <button
    :style="{
      color: label?.is_active ? 'white' : label?.bg_color,
      background: label?.is_active ? label?.bg_color : 'white',
    }"
    class="text-xs w-fit px-2 rounded-md py-1 truncate"
  >
    {{ label?.title }}
  </button>
</template>
<script setup lang="ts">
import type { ICustomLabel } from './type'

const $props = withDefaults(
  defineProps<{
    label: ICustomLabel
  }>(),
  {}
)
</script>
