<template>
  <ClientAvatar
    v-if="isClientLastReadThisMessage()"
    :conversation="conversationStore.select_conversation"
    class="mesage-client-read absolute -right-4 bottom-5 hidden w-3 h-3 text-green-600"
  />
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'

const $emit = defineEmits(['change_last_read_message'])

const $props = withDefaults(
  defineProps<{
    /**thời gian của tin nhắn */
    time?: string | number
  }>(),
  {}
)

const conversationStore = useConversationStore()

/**
 * kiểm tra xem có cho phép hiển thị avatar của khách hàng, thể hiện khách hàng
 * đã đọc đến tin nhắn này hay không
 */
function isClientLastReadThisMessage() {
  if (!conversationStore.select_conversation?.last_read_message || !$props.time)
    return false

  /**thời gian tin nhắn này được tạo */
  const CURRENT_MESSAGE_DATE = new Date($props.time).getTime()
  /**thời gian cuối cùng khách hàng đọc tin nhắn */
  const CLIENT_LAST_READ_DATE = Number(
    conversationStore.select_conversation?.last_read_message
  )

  // chỉ render icon ngoài khoảng thời gian
  if (CURRENT_MESSAGE_DATE < CLIENT_LAST_READ_DATE) return false

  // gửi sự kiện ra bên ngoài để hiển thị icon đầu tiên, các icon còn lại sẽ ẩn
  $emit('change_last_read_message')

  return true
}
</script>
