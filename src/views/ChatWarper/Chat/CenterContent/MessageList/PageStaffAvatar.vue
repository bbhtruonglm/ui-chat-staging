<template>
  <div class="flex-shrink-0 flex items-end">
    <div
      class="w-8 h-8 bg-white rounded-oval flex items-center justify-center"
      v-if="messageStore.isAiMessage(message)"
    >
      <SparklesIcon class="size-5" />
    </div>
    <StaffAvatar
      v-else-if="getStaffId()"
      :id="staff_id"
      class="w-8 h-8 rounded-oval"
    />
    <PageAvatar
      v-else
      :page_info="getPageInfo(message?.fb_page_id)"
      class="w-8 h-8"
    />
  </div>
</template>
<script setup lang="ts">
import { getPageInfo } from '@/service/function'
import { useMessageStore } from '@/stores'
import { ref } from 'vue'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import type { MessageInfo } from '@/service/interface/app/message'
import { SparklesIcon } from '@heroicons/vue/24/solid'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message: MessageInfo
  }>(),
  {}
)

const messageStore = useMessageStore()

/**id nhân viên gửi tin nhắn này */
const staff_id = ref<string>()

/**
 * lấy id của nhân viên gửi tin này nếu có
 * dùng thủ thuật gọi hàm này ở v-if, để chỉ gọi hàm này 1 lần
 */
function getStaffId() {
  // nếu không có meta data thì thôi
  if (!$props.message?.message_metadata) return false

  // cắt ra id nhân viên
  staff_id.value = $props.message?.message_metadata?.split('__')?.[2]

  // nếu không có id nhân viên thì thôi
  if (!staff_id.value || staff_id.value === 'undefined') return false

  // trả về true để hiển thị avatar nhân viên
  return true
}
</script>
