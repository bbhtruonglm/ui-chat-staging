<template>
  <label class="relative inline-flex items-center cursor-pointer gap-2 w-fit">
    <input
      v-model="model"
      type="checkbox"
      class="sr-only peer"
      :disabled="$props.disabled"
    />
    <div
      :class="class_toggle"
      class="w-11 h-6 bg-gray-200 peer-outline-orange-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
    ></div>
    <div
      v-if="$slots.default"
      class="text-sm font-medium"
    >
      <slot />
    </div>
  </label>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**màu của checkbox */
    class_toggle?: string
    disabled?: boolean
  }>(),
  {
    class_toggle: 'peer-checked:bg-orange-500',
  }
)

/** Khai báo v-model */
const model = defineModel<boolean>()
</script>
