  <!-- components/MyCustomToast.vue -->
<template>
  <div
    class="flex gap-2 justify-between p-3 rounded text-sm shadow-lg font-medium max-w-[400px] bg-black text-white"
  >
    <div class="flex gap-2 items-center">
      <component :is="icon" class="w-6 h-6" 
        :class="{
          'text-green-600': type === 'success',
          'text-red-500': type === 'error',
          'text-yellow-300': type === 'warning',
          'text-blue-700': type === 'info',
          'text-orange-500': type === 'question',
        }"
      />
      <p class="w-full text-wrap">{{ message }}</p>
    </div>
    <button @click="close" class="flex flex-col h-full justify-between">
      <XMarkIcon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { CheckCircleIcon, XMarkIcon, ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/solid';

/** props */
const props = defineProps<{
  /** nội dung thông báo */
  message: string
  /** loại nội dung */
  type: 'success' | 'error' | 'info' | 'warning' | 'question'
}>()
/** emit */
const emit = defineEmits(['close'])

/** icon cho từng loại */
const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return ExclamationTriangleIcon
    case 'info':
      return InformationCircleIcon
    case 'warning':
      return ExclamationCircleIcon
    case 'question':
      return ExclamationCircleIcon
    default:
      return ''
  }
})

/** hàm đóng thông báo */
const close = () => emit('close')
</script>

<style>
.Vue-Toastification__toast {
  background: transparent !important;
  padding: 0px !important;
  min-height: auto !important;
  border-radius: 0 !important;
}
</style>
