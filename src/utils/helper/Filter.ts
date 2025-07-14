import { useConversationStore } from "@/stores"
import { singleton } from "tsyringe"

/** các tiện ích liên quan đến bộ lọc */
export interface IFilter {
  /** hàm xóa bộ lọc tương tác */
  clearFilterInteract: () => void
  /** hàm xóa bộ lọc tin nhắn */
  clearFilterMessage: () => void
  /** hàm xóa bộ lọc số điện thoại */
  clearFilterPhone: () => void
  /** hàm xóa bộ lọc ngày */
  clearFilterDate: () => void
  /** hàm xóa bộ lọc gắn nhãn */
  clearFilterTag: () => void
  /** hàm xóa bộ lọc trừ nhãn */
  clearFilterNotTag: () => void
  /** hàm xóa bộ lọc nhân viên */
  clearFilterStaff: () => void
  /** hàm xóa bộ lọc bài viết */
  clearFilterPost: () => void
}

/** các tiện ích liên quan đến bộ lọc */
@singleton()
export class FilterService implements IFilter {
  /**
   * @param STORE_CONVERSATION store dữ liệu cuộc trò chuyện
   */
  constructor(
    private readonly STORE_CONVERSATION = useConversationStore(),
  ) {}

  /** hàm xóa bộ lọc tương tác */
  clearFilterInteract() {
    delete this.STORE_CONVERSATION.option_filter_page_data.display_style
  }
  /** hàm xóa bộ lọc tin nhắn */
  clearFilterMessage() {
    delete this.STORE_CONVERSATION.option_filter_page_data.unread_message
    delete this.STORE_CONVERSATION.option_filter_page_data.not_response_client
    delete this.STORE_CONVERSATION.option_filter_page_data.not_exist_label
    this.STORE_CONVERSATION.option_filter_page_data.is_spam_fb = 'NO'
  }
  /** hàm xóa bộ lọc số điện thoại */
  clearFilterPhone() {
    delete this.STORE_CONVERSATION.option_filter_page_data.have_phone
  }
  /** hàm xóa bộ lọc ngày */
  clearFilterDate() {
    delete this.STORE_CONVERSATION.option_filter_page_data.time_range
  }
  /** hàm xóa bộ lọc gắn nhãn */
  clearFilterTag() {
    delete this.STORE_CONVERSATION.option_filter_page_data.label_id
  }
  /** hàm xóa bộ lọc trừ nhãn */
  clearFilterNotTag() {
    delete this.STORE_CONVERSATION.option_filter_page_data.not_label_id
  }
  /** hàm xóa bộ lọc nhân viên */
  clearFilterStaff() {
    delete this.STORE_CONVERSATION.option_filter_page_data.staff_id
  }
  /** hàm xóa bộ lọc bài viết */
  clearFilterPost() {
    this.STORE_CONVERSATION.option_filter_page_data = {
    ...this.STORE_CONVERSATION.option_filter_page_data,
    ...{
      is_reply: '',
      have_email: undefined,
      have_phone: undefined,
      is_private_reply: '',
      post_id: '',
    },
    ...{ post_id: '', time_range: undefined },
  }
  }

  clearAllFilter() {
    this.clearFilterInteract()
    this.clearFilterMessage()
    this.clearFilterPhone()
    this.clearFilterDate()
    this.clearFilterTag()
    this.clearFilterNotTag()
    this.clearFilterStaff()
    this.clearFilterPost()
  }
}