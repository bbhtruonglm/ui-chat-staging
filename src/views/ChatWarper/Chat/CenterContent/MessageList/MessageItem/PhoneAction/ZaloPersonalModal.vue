<template>
  <Modal
    ref="modal_widget_ref"
    class_modal="w-[432px]"
    class_body="flex gap-2 h-[80dvh]"
  >
    <template #header>
      {{ $t('Zalo cá nhân') }}
      <!-- {{ $t('Hội thoại Zalo cá nhân') }} -->
    </template>
    <template #body>
      <iframe
        id="iframe-zalo"
        class="w-full rounded-xl"
        :src="`${DOMAIN_CHATBOT}/zalo-personal-conversation?org_id=${
          orgStore.selected_org_id
        }&actual_client_id=${message?.fb_client_id}&actual_page_id=${
          message?.fb_page_id
        }&message_id=${message?._id}&token=${getItem('access_token')}`"
        frameborder="0"
      ></iframe>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { useOrgStore } from '@/stores'
import { N4SerivceAppZaloPersonal } from '@/utils/api/N4Service/ZaloPersonal'
import { container } from 'tsyringe'
import { onMounted, onUnmounted, ref } from 'vue'
import { getItem } from '@/service/helper/localStorage'

import Modal from '@/components/Modal.vue'

import type { MessageInfo } from '@/service/interface/app/message'

/** link gốc của chatbot */
const DOMAIN_CHATBOT = getDomain()

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

const orgStore = useOrgStore()

/**ref của modal kết nối nền tảng */
const modal_widget_ref = ref<InstanceType<typeof Modal>>()

class Main {
  constructor(
    private readonly API = container.resolve(N4SerivceAppZaloPersonal)
  ) {}

  /** lấy id của khách */
  async getClientId(page_id?: string) {
    // nếu không có trang nào thì thôi
    if (!page_id || !$props.message) return

    // lấy id của khách với có số điện thoại trong tin nhắn và đã nhắn cho page
    const RES = await this.API.getClientId(page_id, $props.message?._id)

    return RES
  }

  /**ẩn hiện modal của component */
  toggleModal() {
    modal_widget_ref.value?.toggleModal()
  }

  /** hàm xử lý khi nhân được sự kiện từ iframe zalo personal core */
  async handleEvent(event: MessageEvent) {
    // nếu không phải từ zalo personal core thi thôi
    if (event.data?.from !== 'ZALO_PERSONAL_CORE') return

    // id của trang cần lấy id khách hàng
    const CLIENT_ID = await $main.getClientId(event.data.data.page_id)

    const IFRAME_ZALO = document.getElementById(
      'iframe-zalo'
    ) as HTMLIFrameElement

    // gửi id khách hàng vào iframe zalo personal core
    IFRAME_ZALO?.contentWindow?.postMessage(
      {
        type: 'get.client_id',
        from: 'ZALO_PERSONAL_CONTAINER',
        data: {
          client_id: CLIENT_ID,
        },
      },
      '*'
    )
  }
}

const $main = new Main()

/** hàm xử lý sự kiện khi nhân được từ iframe zalo personal core */
const handleMessage = $main.handleEvent.bind($main)

/** link gốc của chatbot  */
function getDomain() {
  // nếu là prod thì link gốc là https://retion.ai/chat
  if (window.location.origin === 'https://retion.ai')
    return 'https://retion.ai/chat'
  return window.location.origin
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
