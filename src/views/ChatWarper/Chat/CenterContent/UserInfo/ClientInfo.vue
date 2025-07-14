<template>
  <Modal
    @open_modal="getClientChatbotInfo"
    @close_modal="onCloseModal"
    ref="client_info_modal_ref"
    class_modal="w-[1100px] h-[710px]"
    class_body="flex gap-2"
  >
    <template v-slot:header>
      {{ $t('v1.view.main.dashboard.chat.client.title') }}
    </template>
    <template v-slot:body>
      <LeftBar />
      <RightBar />
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConversationStore } from '@/stores'

import Modal from '@/components/Modal.vue'
import LeftBar from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/LeftBar.vue'
import RightBar from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar.vue'

import { toastError } from '@/service/helper/alert'
import { ChatbotAppClient } from '@/utils/api/Chatbot'

const conversationStore = useConversationStore()

/**ref của modal */
const client_info_modal_ref = ref<InstanceType<typeof Modal>>()

/**id của trang */
const page_id = computed(
  () => conversationStore.select_conversation?.fb_page_id
)
/**id của khách hàng */
const client_id = computed(
  () => conversationStore.select_conversation?.fb_client_id
)

/**lấy thông tin của khách hàng chatbot */
async function getClientChatbotInfo() {
  try {
    // nếu chưa có id của trang hoặc id của khách hàng thì không làm gì cả
    if (!page_id.value || !client_id.value) return

    // lấy thông tin khách hàng
    conversationStore.chatbot_client = await new ChatbotAppClient(
      page_id.value,
      client_id.value
    ).readClient()
  } catch (e) {
    // hiển thị lỗi
    toastError(e)
  }
}
/**toggle modal */
function toggleModal() {
  client_info_modal_ref.value?.toggleModal()
}
/**xử lý khi tắt modal */
function onCloseModal() {
  // reset lại cờ chỉnh sửa
  conversationStore.is_edit_info = false

  // reset toàn bộ các cờ chỉnh sửa
  conversationStore.is_edit_client = {
    contact_create: {},
    contact_remove: {},
    contact_update: {},
  }
}

defineExpose({ toggleModal })
</script>
