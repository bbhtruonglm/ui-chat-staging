<template>
  <input
    v-if="true_value || false_value"
    @click.stop
    v-model="model"
    ref="checkbox_ref"
    type="checkbox"
    :true-value="true_value"
    :false-value="false_value"
    class="custom-checkbox"
  />
  <!-- @click.stop -->
  <input
    v-else
    v-model="model"
    ref="checkbox_ref"
    type="checkbox"
    class="custom-checkbox"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'

const $props = withDefaults(
  defineProps<{
    /**giá trị đúng của checkbox này */
    true_value?: any
    /**giá trị sai của checkbox này */
    false_value?: any
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel<any>()

/**ref của radio button */
const checkbox_ref = ref<HTMLInputElement>()

/**click vào checkbox */
function click() {  
  checkbox_ref.value?.click()
}

defineExpose({ click })
</script>
<style scoped lang="scss">
.custom-checkbox {
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
