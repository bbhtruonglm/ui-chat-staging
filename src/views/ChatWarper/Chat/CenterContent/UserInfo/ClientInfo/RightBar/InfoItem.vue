<template>
  <div class="flex items-center text-sm group">
    <div class="w-28 font-semibold ml-5 flex-shrink-0">
      {{ title }}
    </div>
    <div>
      {{ value }}
    </div>
  </div>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**tiêu đề */
    title?: string
    /**giá trị */
    value?: string
  }>(),
  {}
)
</script>
