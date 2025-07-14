<template>
  <label class="flex items-center gap-2 cursor-pointer">
    <input
      v-model="model"
      type="radio"
      :value="value"
      class="accent-black w-5 h-5"
      :disabled
    />
    <span class="text-sm font-medium">
      {{ title }}
    </span>
  </label>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**tiêu đề */
    title: string
    /**giá trị */
    value?: string | boolean
    /**trạng thái disabled */
    disabled?: boolean
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel()
</script>
