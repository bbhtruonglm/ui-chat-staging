<template>
  <div
    :class="source?.unread_message_amount ? 'font-medium' : 'text-slate-500'"
    class="flex items-center text-xs gap-2 justify-between"
  >
    <div class="truncate h-5">
      <template v-if="source?.last_message_type === 'page'">
        {{ $t('v1.view.main.dashboard.chat.you') }}
      </template>
      {{ source?.last_message }}
    </div>
    <Badge
      v-if="isNewMessage()"
      :value="source?.unread_message_amount!"
      class="flex-shrink-0"
    />
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'

import Badge from '@/components/Badge.vue'

import type { ConversationInfo } from '@/service/interface/app/conversation'

const $props = withDefaults(
  defineProps<{
    source?: ConversationInfo
  }>(),
  {}
)

const conversationStore = useConversationStore()

/**có đánh dấu hội thoại này là chưa đọc không */
function isNewMessage(): boolean {
  // nếu đang chọn hội thoại này thì không hiện
  if (
    conversationStore.select_conversation?.data_key ===
      $props.source?.data_key &&
    !conversationStore.select_conversation?.is_force_unread
  )
    return false

  // tính toán dựa trên số tin nhắn chưa đọc
  return !!$props.source?.unread_message_amount
}
</script>
