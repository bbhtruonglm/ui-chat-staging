<template>
  <div class="relative">
    <SearchBoldIcon
      class="w-3.5 h-3.5 text-slate-500 absolute top-1/2 -translate-y-1/2 left-2"
    />
    <input
      :class="class_input"
      v-model="model"
      type="text"
      :placeholder="placeholder"
      class="w-52 text-sm font-normal bg-slate-100 rounded py-1 px-2 pl-7 focus:outline-none placeholder-slate-500"
    />
  </div>
</template>
<script setup lang="ts">
import { useConnectPageStore } from '@/stores'
import { useI18n } from 'vue-i18n'

import SearchBoldIcon from '@/components/Icons/SearchBold.vue'

const connectPageStore = useConnectPageStore()
const { t: $t } = useI18n()

const $props = withDefaults(
  defineProps<{
    /**nội dung của input */
    placeholder?: string
    /**class thêm cho input */
    class_input?: string
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel<string>()
</script>
