import { N4SerivceAppConversation } from '@/utils/api/N4Service/Conversation'
import { useCommonStore, useConversationStore } from '@/stores'
import { error } from '@/utils/decorator/Error'
import { loadingV2 } from '@/utils/decorator/Loading'
import { ToastV2 } from '@/utils/helper/Alert/Toast'
import { DateHandle } from '@/utils/helper/DateHandle'
import { container } from 'tsyringe'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

/**thiết lập tắt bật chatbot của khách hàng */
export function composableService() {
  const conversationStore = useConversationStore()
  const commonStore = useCommonStore()
  const { t: $t } = useI18n()
  const $toast = container.resolve(ToastV2)
  const $date_handle = container.resolve(DateHandle)

  class Main {
    /**
     * @param API gọi API
     */
    constructor(
      private readonly API = container.resolve(N4SerivceAppConversation)
    ) {}

    /**tắt bật chatbot */
    @loadingV2(commonStore, 'is_loading_full_screen')
    @error()
    async manageChatbot(status: boolean) {
      // xác thực dữ liệu
      if (!conversationStore.select_conversation?.fb_page_id) return
      if (!conversationStore.select_conversation?.fb_client_id) return

      // thao tác chatbot

      /**kết quả */
      const RES = await this.API.manageChatbot(
        conversationStore.select_conversation?.fb_page_id,
        conversationStore.select_conversation?.fb_client_id,
        status
      )

      // ghi lại dữ liệu mới
      conversationStore.select_conversation.bot_resume_at = RES?.bot_resume_at

      // cảnh báo khi bot tắt
      if (status) this.alertDisableChatbot()
    }
    /**cảnh báo khi bot tắt */
    alertDisableChatbot() {
      /**giờ bot bật */
      const DATE_RESUME_AT = $date_handle.format(
        conversationStore.select_conversation?.bot_resume_at,
        'hh:mm'
      )

      /**nội dung thông báo */
      const ALERT_MESSAGE = $t(
        'Trợ lý AI đã tắt. Trợ lý AI sẽ tự động bật lại sau 60 phút nữa (lúc _)',
        { date: DATE_RESUME_AT }
      )

      // cảnh báo
      $toast.warning(ALERT_MESSAGE, 'top-center', 3000)
    }
    /**tính toán trạng thái */
    calcStatus(): boolean {
      /**thời gian bot quay lại chạy */
      const BOT_RESUME_AT = conversationStore.select_conversation?.bot_resume_at

      // nếu không có -> bot bật
      if (!BOT_RESUME_AT) return true

      // nếu chưa đến giờ -> bot tắt
      if (BOT_RESUME_AT > Date.now()) return false

      // đã đến giờ -> bot bật
      return true
    }
  }
  const $main = new Main()

  /**trạng thái hiện tại */
  const is_enable = computed({
    get: () => $main.calcStatus(),
    set: async val => await $main.manageChatbot(!val),
  })

  // tính lại khi đổi hội thoại
  watch(
    () => conversationStore.select_conversation?.fb_client_id,
    () => $main.calcStatus()
  )

  return { is_enable }
}