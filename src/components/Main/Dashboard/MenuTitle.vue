<template>
  <h6 class="text-xs font-medium text-slate-500 py-1 px-2">
    {{ title }}
  </h6>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /** tiêu đề */
    title: string
  }>(),
  {}
)
</script>
