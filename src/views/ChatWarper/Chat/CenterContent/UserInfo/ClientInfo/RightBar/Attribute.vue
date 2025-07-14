<template>
  <div class="bg-slate-100 py-1 px-5 rounded text-sm font-semibold">
    {{ $t('v1.view.main.dashboard.chat.client.attribute_detail') }}
  </div>
  <EditItem
    v-if="conversationStore.chatbot_client?.client_attribute"
    v-for="(value, key) of conversationStore.chatbot_client?.client_attribute"
    @update="list_attribute_update[key] = 1"
    :title="key"
    :placeholder="$t('v1.view.main.dashboard.chat.client.full_name_require')"
    v-model="conversationStore.chatbot_client.client_attribute[key]"
  />
  <button
    @click="$external_site.openPageChatbot('dashboard/attribute')"
    class="py-1 px-5 text-sm font-medium text-slate-500 flex gap-1 items-center w-fit mb-3"
  >
    {{ $t('v1.view.main.dashboard.chat.client.add_attr') }}
    <NewTabIcon class="w-3.5 h-3.5" />
  </button>
  <div class="bg-slate-100 py-1 px-5 rounded text-sm font-semibold">
    {{ $t('v1.view.main.dashboard.chat.client.system_attribute') }}
  </div>
  <InfoItem
    title="user_id"
    :value="conversationStore.select_conversation?.data_key"
  />
  <InfoItem
    title="ps_id"
    :value="conversationStore.select_conversation?.fb_client_id"
  />
  <InfoItem
    title="page_id"
    :value="conversationStore.select_conversation?.fb_page_id"
  />
  <InfoItem
    title="gender"
    :value="conversationStore.select_conversation?.client_bio?.fb_info?.gender"
  />
  <InfoItem
    title="timezone"
    value="+7 GMT"
  />
  <InfoItem
    title="locale"
    value="vi_VN"
  />
  <InfoItem
    title="uid_id"
    :value="conversationStore.select_conversation?.client_bio?.fb_uid"
  />
  <InfoItem
    title="last_seen"
    :value="conversationStore.select_conversation?.last_read_message"
  />
  <InfoItem
    title="first_name"
    :value="
      conversationStore.chatbot_client?.client_first_name ||
      conversationStore.select_conversation?.client_name
    "
  />
  <InfoItem
    title="last_name"
    :value="conversationStore.chatbot_client?.client_last_name"
  />
</template>
<script setup lang="ts">
import { useCommonStore, useConversationStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { getItem } from '@/service/helper/localStorage'
import { computed, ref, watch } from 'vue'
import { toastError } from '@/service/helper/alert'
import { openNewTab } from '@/service/function'

import EditItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/EditItem.vue'
import InfoItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/InfoItem.vue'

import NewTabIcon from '@/components/Icons/NewTab.vue'
import { mapValues } from 'lodash'
import { ChatbotAppClient } from '@/utils/api/Chatbot'
import { LocaleSingleton } from '@/utils/helper/Locale'
import { container } from 'tsyringe'
import { ExternalSite } from '@/utils/helper/ExternalSite'

const conversationStore = useConversationStore()
const commonStore = useCommonStore()
const { t: $t } = useI18n()
const $external_site = container.resolve(ExternalSite)

/**danh sách các thuộc tính bị sửa */
const list_attribute_update = ref<Record<string, 1>>({})

/**id của trang */
const page_id = computed(
  () => conversationStore.select_conversation?.fb_page_id
)
/**id của khách hàng */
const client_id = computed(
  () => conversationStore.select_conversation?.fb_client_id
)

// cập nhật thuộc tính chatbot của khách hàng này khi bấm sửa
watch(() => conversationStore.is_edit_info, updateAttributeChatbot)

/**cập nhật thuộc tính chatbot của khách hàng này */
function updateAttributeChatbot(is_edit_info: boolean) {
  // chỉ chạy khi kết thúc việc sửa thông tin
  if (
    !page_id.value ||
    !client_id.value ||
    is_edit_info ||
    commonStore.is_loading_full_screen
  )
    return

  // bật loading
  commonStore.is_loading_full_screen = true

  try {
    /**lọc ra cá thuộc tính được sửa */
    const UPDATE_ATTRIBUTE = mapValues(
      list_attribute_update.value,
      (v, key) => conversationStore.chatbot_client?.client_attribute?.[key]
    )

    // gửi lên server
    new ChatbotAppClient(page_id.value, client_id.value).editAttribute(
      UPDATE_ATTRIBUTE
    )

    // reset lại cờ sau khi xong
    list_attribute_update.value = {}
  } catch (e) {
    // bắn lỗi ra thông báo
    toastError(e)
  }

  // tắt loading
  commonStore.is_loading_full_screen = false
}
</script>
