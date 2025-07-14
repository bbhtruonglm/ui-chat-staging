<template>
  <div class="flex items-center text-sm group">
    <div class="w-28 font-semibold ml-5 flex-shrink-0 truncate">
      {{ title }}
    </div>
    <div v-if="!conversationStore.is_edit_info">
      {{ model }}
    </div>
    <div
      v-else
      class="flex items-center gap-1"
    >
      <input
        v-model="model"
        @input="$emit('update')"
        :placeholder
        class="py-2 px-3 rounded-md border focus:outline-none w-80"
      />
      <BinIcon
        v-if="is_allow_remove"
        @click="$emit('remove')"
        class="text-slate-500 w-5 h-5 cursor-pointer hidden group-hover:block"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'

import BinIcon from '@/components/Icons/Bin.vue'

const conversationStore = useConversationStore()

const $emit = defineEmits(['remove', 'update'])

const $props = withDefaults(
  defineProps<{
    /**tiêu đề */
    title?: string | number
    /**hướng dẫn */
    placeholder?: string
    /**có cho phép xoá hẳn không */
    is_allow_remove?: boolean
  }>(),
  {}
)

/**giá trị của model */
const model = defineModel()
</script>
