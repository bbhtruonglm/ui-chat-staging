<template>
  <input
    @click.stop
    ref="radio_ref"
    v-model="model"
    type="radio"
    :value="value"
    class="custom-radio"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'

const $props = withDefaults(
  defineProps<{
    /**giá trị custom của radio này */
    value?: string
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel<any>()

/**ref của input radio */
const radio_ref = ref<HTMLInputElement>()

/**click vào radio */
function click() {
  radio_ref.value?.click()
}

defineExpose({ click })
</script>
<style scoped lang="scss">
.custom-radio {
  @apply appearance-none w-4 h-4 shadow-sm bg-white border-[1.5px] border-black rounded relative cursor-pointer;

  &:checked {
    @apply bg-black;

    &::after {
      content: '';
      @apply absolute border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 w-1 h-2;
    }
  }

  &:disabled {
    @apply cursor-not-allowed border-gray-200 bg-gray-100;

    &::after {
      @apply border-gray-200;
    }
  }
}
</style>
