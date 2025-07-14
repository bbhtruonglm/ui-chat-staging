<template>
  <div
    v-if="isVisible()"
    class="my-2 px-3 text-slate-100 w-fit mx-auto bg-slate-600 rounded-lg text-center text-xs font-medium"
  >
    {{ $t('v1.view.main.dashboard.chat.filter.message.unread') }}
  </div>
</template>
<script setup lang="ts">
import { useConversationStore, useMessageStore } from '@/stores'

const $props = withDefaults(
  defineProps<{
    /**vị trí hiện tại của tin nhắn */
    index: number
  }>(),
  {}
)

const conversationStore = useConversationStore()
const messageStore = useMessageStore()

/**có hiển thị cảnh báo tin nhắn chưa đọc không */
function isVisible(): boolean {
  /**số tin nhắn chưa đọc hiện tại */
  const UNREAD = conversationStore.select_conversation?.unread_message_amount || 0

  // nếu không có tin nhắn chưa đọc thì không hiển thị
  if (!UNREAD) return false

  /**vị trí của tin nhắn này tính từ dưới lên trên */
  const BOTTOM_INDEX = messageStore.list_message?.length - $props.index

  // hiển thị nếu vị trí tin nhắn khớp với số tin nhắn chưa đọc
  return BOTTOM_INDEX === UNREAD
}
</script>
