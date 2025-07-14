<template>
  <ul class="flex gap-3 text-sm w-full">
    <li
      v-for="(item, index) in QUICK_FILTER_OPTIONS"
      class="flex items-center justify-center gap-1 rounded p-1.5 min-w-7 max-h-7 cursor-pointer transition-[flex-grow_0.3s_ease]"
      :class="{
        [`text-white py-1 flex-grow ${item.color}`]:
          conversationStore.selected_quick_filter === item.value,
        'bg-slate-200': conversationStore.selected_quick_filter !== item.value,
      }"
      @click="selectQuickFilter(item.value)"
      v-tooltip="item.title"
    >
      <component
        :is="item.icon"
        class="size-4"
      />
      <p
        v-if="conversationStore.selected_quick_filter === item.value"
        class="fomat-medium"
      >
        {{ item.title }}
      </p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useChatbotUserStore, useConversationStore } from '@/stores'

import {
  BoltIcon,
  EyeSlashIcon,
  InboxIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/vue/24/solid'

const { t: $t } = useI18n()

/** dach sách các bộ lọc nhanh */
const QUICK_FILTER_OPTIONS = [
  {
    icon: InboxIcon,
    title: $t('Tất cả'),
    color: 'bg-slate-700',
    value: 'ALL',
  },
  {
    icon: BoltIcon,
    title: $t('Quan trọng'),
    color: 'bg-blue-700',
    value: 'IMPORTANT',
  },
  {
    icon: EyeSlashIcon,
    title: $t('Chưa đọc'),
    color: 'bg-violet-600',
    value: 'UNREAD',
  },
  {
    icon: UserIcon,
    title: $t('Của tôi'),
    color: 'bg-green-500',
    value: 'MINE',
  },
  {
    icon: PhoneIcon,
    title: $t('Liên hệ'),
    color: 'bg-orange-500',
    value: 'CONTACT',
  },
]

const chatbotUserStore = useChatbotUserStore()
const conversationStore = useConversationStore()

/**chọn bộ lọc nhanh */
function selectQuickFilter(value: string) {
  
  conversationStore.selected_quick_filter = value

  // chọn bộ lọc theo bộ lọc nhanh
  switch (value) {
    // lọc hội thoại chưa trả lời
    case 'IMPORTANT':
      conversationStore.option_filter_page_data = {
        ...dataClearedQuickFilter(),
        not_response_client: 'true'
      }
      break
    // lọc hội thoại chưa đọc
    case 'UNREAD':
      conversationStore.option_filter_page_data = {
        ...dataClearedQuickFilter(),
        unread_message: 'true'
      }
      break
    // lọc hội thoại của tôi
    case 'MINE':
      conversationStore.option_filter_page_data = {
        ...dataClearedQuickFilter(),
        staff_id: [
          chatbotUserStore.chatbot_user?.user_id || '',
        ]
      }
      break
    // lọc hội thoại có số hiện thoại
    case 'CONTACT':
      conversationStore.option_filter_page_data = {
        ...dataClearedQuickFilter(),
        have_phone: 'YES'
      }
      break
    // xóa hết các bộ lọc nhanh
    case 'ALL':
      conversationStore.option_filter_page_data = dataClearedQuickFilter()
      break
    default:
      break
  }
}

/** dữ liệu xóa các bộ lọc nhanh khác */
function dataClearedQuickFilter() {
  const {
    not_response_client,
    unread_message,
    staff_id,
    have_phone,
    ...rest
  } = conversationStore.option_filter_page_data

  // trả về data bộ lọc trừ các bộ lọc nhanh khác
  return rest
}
</script>
