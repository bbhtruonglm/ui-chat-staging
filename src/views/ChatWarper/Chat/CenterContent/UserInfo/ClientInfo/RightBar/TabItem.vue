<template>
  <button
    @click="model = name"
    :class="model === name ? 'bg-white shadow-sm' : 'text-gray-500'"
    class="py-1 px-3 rounded text-sm font-medium w-fit hover:brightness-90"
  >
    {{ title }}
  </button>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /** key của tab này*/
    name: string
    /**tiêu đề của tab */
    title: string
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel<string>()
</script>
