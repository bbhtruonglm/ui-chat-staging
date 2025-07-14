<template>
  <button
    @click="model = value"
    :class="
      model === value
        ? 'shadow-sm hover:brightness-90 bg-white'
        : 'text-gray-500 '
    "
    class="text-left py-1 px-3 rounded text-sm font-medium"
  >
    {{ title }}
  </button>
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

const model = defineModel()
</script>
