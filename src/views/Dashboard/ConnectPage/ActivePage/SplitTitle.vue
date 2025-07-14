<template>
  <div class="flex items-center gap-2.5">
    <div class="flex-grow">
      <hr />
    </div>
    <div class="flex-shrink-0 text-xs font-medium text-slate-500">
      {{ title }}
    </div>
    <div class="flex-grow">
      <hr />
    </div>
  </div>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**tiêu đề */
    title: string
  }>(),
  {}
)
</script>
