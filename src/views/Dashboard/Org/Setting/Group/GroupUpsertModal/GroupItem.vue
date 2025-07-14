<template>
  <button
    @click="model = !model"
    class="bg-white p-3 rounded-xl flex items-center gap-2 text-left"
  >
    <slot name="avatar" />
    <div class="flex-grow min-w-0">
      <div class="font-medium text-sm">{{ name }}</div>
      <div class="flex items-center gap-1">
        <slot name="type" />
        <span class="text-xs text-slate-500">
          <slot name="info" />
        </span>
      </div>
    </div>
    <Toggle
      @click.stop
      v-model="model"
      class_toggle="peer-checked:bg-black"
    />
  </button>
</template>
<script setup lang="ts">
import Toggle from '@/components/Toggle.vue'

const $props = withDefaults(
  defineProps<{
    /**tên */
    name?: string
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel<boolean>()
</script>
