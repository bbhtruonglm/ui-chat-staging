<template>
  <div class="flex flex-col gap-1">
    <div class="text-sm font-medium">
      {{ title }}
    </div>
    <div class="grid gap-6 grid-cols-1 md:grid-cols-4">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**tiêu đề */
    title?: string
  }>(),
  {}
)
</script>
