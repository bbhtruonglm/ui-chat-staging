<template>
  <button
    @click="scrollToBottomMessage(messageStore.list_message_id)"
    v-if="messageStore.is_show_to_bottom"
    class="-top-20 absolute left-1/2 -translate-x-1/2 border rounded-full flex items-center justify-center w-9 h-9 bg-white shadow-xl"
  >
    <img src="@/assets/icons/arrow-down-orange.svg" />
  </button>
</template>
<script setup lang="ts">
import { useMessageStore } from '@/stores'
import { scrollToBottomMessage } from '@/service/function'

const messageStore = useMessageStore()
</script>
