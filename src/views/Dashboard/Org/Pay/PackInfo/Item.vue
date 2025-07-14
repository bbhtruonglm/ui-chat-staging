<template>
  <div class="flex text-sm">
    <div class="w-36 font-medium">
      {{ title }}
    </div>
    <div class="font-bold">
      <slot />
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
