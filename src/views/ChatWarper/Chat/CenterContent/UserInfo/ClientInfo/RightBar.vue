<template>
  <div
    class="flex-grow min-w-0 bg-white rounded-md flex flex-col p-2 gap-2 overflow-y-auto"
  >
    <div class="flex justify-between items-center border-b p-2 flex-shrink-0">
      <div class="font-semibold">
        {{ client_name }}
      </div>
      <button
        @click="
          conversationStore.is_edit_info = !conversationStore.is_edit_info
        "
        :class="
          conversationStore.is_edit_info
            ? 'text-white bg-blue-700'
            : 'text-blue-700 bg-blue-100'
        "
        class="rounded-md text-sm py-2 px-4 gap-2 flex items-center justify-center"
      >
        <template v-if="conversationStore.is_edit_info">
          {{ $t('Lưu') }}
        </template>
        <template v-else>
          {{ $t('v1.view.main.dashboard.chat.client.edit') }}
        </template>
      </button>
    </div>
    <div class="p-2 flex flex-col gap-2.5 flex-grow min-h-0 overflow-y-auto">
      <div
        class="p-1 bg-gray-100 rounded-md w-fit flex items-center flex-shrink-0"
      >
        <TabItem
          v-model="current_tab"
          name="INFO"
          :title="$t('v1.view.main.dashboard.chat.client.info')"
        />
        <TabItem
          v-model="current_tab"
          name="ATTR"
          :title="$t('v1.view.main.dashboard.chat.client.attribute')"
        />
        <TabItem
          v-model="current_tab"
          name="AI"
          :title="$t('v1.view.main.dashboard.chat.client.ai_detect')"
        />
      </div>
      <div class="flex-grow min-h-0 overflow-y-auto flex flex-col gap-2.5">
        <Info v-if="current_tab === 'INFO'" />
        <Attribute v-if="current_tab === 'ATTR'" />
        <Ai v-if="current_tab === 'AI'" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import TabItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/TabItem.vue'
import Info from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/Info.vue'
import Attribute from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/Attribute.vue'
import Ai from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/Ai.vue'

const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**tab hiện tại đang được chọn */
const current_tab = ref<'INFO' | 'ATTR' | 'AI'>('INFO')

/**tên khách hàng */
const client_name = computed(
  () => conversationStore.select_conversation?.client_name
)
</script>
