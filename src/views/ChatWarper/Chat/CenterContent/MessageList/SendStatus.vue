<template>
  <button
    v-if="is_error"
    v-tooltip.top="$t('v1.view.main.dashboard.chat.message.error_send_message')"
    class="text-white bg-red-500 rounded-full text-xxs size-2.5 flex items-center justify-center icon-position"
  >
    !
  </button>
  <CheckIcon
    v-else
    class="w-3 h-3 text-gray-500 icon-position"
  />
</template>
<script setup lang="ts">
import CheckIcon from '@/components/Icons/Check.vue'

const $props = withDefaults(
  defineProps<{
    /**có bị lỗi không */
    is_error?: boolean
  }>(),
  {}
)
</script>
<style scoped lang="scss">
.icon-position {
  @apply absolute -right-2.5 bottom-2;
}
</style>
