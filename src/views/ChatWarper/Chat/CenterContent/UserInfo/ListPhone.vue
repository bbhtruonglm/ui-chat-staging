<template>
  <Dropdown
    ref="client_menu_ref"
    width="349px"
    height="auto"
    :is_fit="false"
    position="BOTTOM"
    :back="309"
    :distance="9"
    class_content="flex flex-col gap-1 max-h-[210px] overflow-hidden overflow-y-auto"
  >
    <div
      v-if="is_loading"
      class="relative z-10"
    >
      <div class="absolute top-6 left-1/2 translate-x-1/2">
        <Loading class="mx-auto" />
      </div>
    </div>

    <!-- Nếu có cuộc gọi thì hiển thị danh sách -->
    <PhoneItem
      v-for="(item, index) in unique_calls"
      :key="index"
      :phone_number="item.phone"
      :created_at="item.createdAt"
      :last_call="item.updatedAt"
    />

    <!-- Nếu không có cuộc gọi nào thì hiển thị thông báo -->
    <div
      v-if="unique_calls.length === 0"
      class="text-gray-500 text-center py-8"
    >
       <p v-if="!is_loading">{{ $t('Chưa có cuộc gọi nào') }}</p>
    </div>
  </Dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConversationStore, useOrgStore } from '@/stores'
import { container } from 'tsyringe'

/**component*/
import Dropdown from '@/components/Dropdown.vue'
import Loading from '@/components/Loading.vue'

/**component con*/
import PhoneItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ListPhone/PhoneItem.vue'

/**Api*/
import { MerchantContact } from '@/utils/api/Merchant'
import { Toast } from '@/utils/helper/Alert/Toast'
import { useI18n } from 'vue-i18n'

/*Biến store**/
const orgStore = useOrgStore()

const conversationStore = useConversationStore()

/**trạng thái loading */
const is_loading = ref(false)

const $toast = container.resolve(Toast)

const { t: $t } = useI18n()

/**ref của dropdown danh sách cuộc gọi của khách hàng */
const client_menu_ref = ref<InstanceType<typeof Dropdown>>()

/**Biến lưu danh sách api đang trả về*/
const conversation_lists = ref<any[]>([])

/** Mảng mới gồm các cuộc gọi không trùng số, chỉ giữ cuộc gọi mới nhất theo từng số điện thoại */
const unique_calls = computed(() => {
  /** Map để lưu các phần tử, với key là số điện thoại */
  const MAP = new Map<string, any>()

  // Duyệt qua danh sách cuộc gọi
  conversation_lists.value.forEach(item => {
    /** Phần tử đã tồn tại trong Map theo số điện thoại (nếu có) */
    const EXISTING = MAP.get(item.phone)

    /** Thời gian của cuộc gọi hiện tại (ưu tiên end_time, fallback là createdAt) */
    const CURRENT_TIME = item.end_time || item.createdAt

    /** Thời gian của phần tử đã có trong Map (nếu có) */
    const EXISTING_TIME = EXISTING?.end_time || EXISTING?.createdAt

    // Nếu chưa có hoặc phần tử hiện tại mới hơn thì cập nhật
    if (!EXISTING || new Date(CURRENT_TIME) > new Date(EXISTING_TIME)) {
      MAP.set(item.phone, item)
    }
  })

  //Trả về mảng các cuộc gọi duy nhất theo số điện thoại (cuộc gọi mới nhất)
  return Array.from(MAP.values())
})

/** Ẩn/hiện dropdown danh sách cuộc gọi của khách hàng */
function toggle($event?: MouseEvent) {
  // Gọi phương thức toggleDropdown() trên component menu để ẩn/hiện dropdown
  client_menu_ref.value?.toggleDropdown($event)
  // Reset danh sách cuộc gọi trước khi gọi API
  conversation_lists.value = []
  // Gọi lại API lấy lịch sử cuộc gọi mỗi khi toggle (dù là mở hay đóng)
  $main.fetchCallHistory()
}

class Main {
  /**
   * @param API gọi API
   */
  constructor(private readonly API = container.resolve(MerchantContact)) {}

  /** Lấy danh sách cuộc gọi */
  async fetchCallHistory() {
    // Bật loading
    is_loading.value = true

    try {
      /** ID tổ chức được chọn */
      const ORG_ID = orgStore.selected_org_id
      /** ID trang hiện tại */
      const PAGE_ID = conversationStore.select_conversation?.fb_page_id
      /** ID khách hàng đang xem */
      const CLIENT_ID = conversationStore.select_conversation?.fb_client_id

      // Kiểm tra xem cả ba giá trị có tồn tại không
      if (!ORG_ID || !PAGE_ID || !CLIENT_ID) {
        $toast.error(
          $t('Vui lòng chọn trang và khách hàng trước khi thực hiện')
        )
        is_loading.value = false // Tắt loading nếu có lỗi
        return
      }

      /** Gọi API để lấy danh sách cuộc gọi */
      await this.API.getCallHistory(ORG_ID, PAGE_ID, CLIENT_ID)
    } catch (error) {
      console.error('Error fetching call history:', error)

      if (Array.isArray(error)) {
        // API đang trả về mảng nên gán trực tiếp vào danh sách cuộc gọi
        conversation_lists.value = error
        return
      }
    } finally {
      // Tắt loading
      is_loading.value = false
    }
  }
}
const $main = new Main()

defineExpose({ toggle })
</script>
