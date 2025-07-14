import { formatDistanceStrict } from 'date-fns'
import viLocale from 'date-fns/locale/vi'

import type { MessageInfo } from '@/service/interface/app/message'
import { LocaleSingleton, type ILocale } from '@/utils/helper/Locale'

/**thời gian tin nhắn */
type IMessageDate = string | number

/**tính toán hiển thị, cảnh báo tin nhắn của khách có bị nhân viên rep chậm không */
export interface ICheckSlowReply {
  /**tổng kết lại là tin nhắn này có đánh dấu rep chậm không */
  isSlowReply(): boolean | undefined
  /**AI báo rep chậm, nhưng chưa đủ điều kiện cảnh báo */
  isWarning(): boolean | undefined
  /**thời gian rep chậm là bao lâu */
  getDuration(): string | undefined
  /**tin nhắn có cần hiển thị thời gian rep không */
  isShowDuration(): boolean | undefined
}

/**tính toán hiển thị, cảnh báo tin nhắn của khách có bị nhân viên rep chậm không */
export class CheckSlowReply implements ICheckSlowReply {
  /**dịch vụ locale */
  private readonly LOCALE_SERVICE: ILocale = LocaleSingleton.getInst()

  /**
   * @param CURRENT_MESSAGE dữ liệu tin nhắn hiện tại
   * @param NEXT_MESSAGE dữ liệu tin nhắn tiếp theo (nếu có)
   */
  constructor(
    private readonly CURRENT_MESSAGE: MessageInfo,
    private readonly NEXT_MESSAGE?: MessageInfo
  ) {}

  /**lấy thời gian của tin nhắn */
  #getDate(message?: MessageInfo): string | undefined {
    return message?.time || message?.createdAt
  }
  /**
   * tính toán thời gian giữa 2 tin nhắn
   * @deprecated dùng DateHandle
   */
  #calcDuration(current_date: IMessageDate, next_date: IMessageDate): string {
    /**locale hiện tại */
    const LOCALE = this.LOCALE_SERVICE.get()

    /**tuỳ chọn khi tính khoảng thời gian */
    const OPTIONS = LOCALE === 'vn' ? { locale: viLocale } : undefined

    // trả về thời gian giữa 2 tin nhắn
    return formatDistanceStrict(
      new Date(current_date),
      new Date(next_date),
      OPTIONS
    )
  }

  getDuration() {
    /**thời gian của tin nhắn hiện tại */
    const CURRENT_DATE = this.#getDate(this.CURRENT_MESSAGE)

    // nếu không có thời gian thì thôi
    if (!CURRENT_DATE) return

    /**
     * thời gian của tin nhắn tiếp theo
     * - nếu không có tin nhắn tiếp theo thì lấy thời gian hiện tại
     */
    const NEXT_DATE = this.#getDate(this.NEXT_MESSAGE) || new Date().getTime()

    // trả về thời gian giữa 2 tin nhắn
    return this.#calcDuration(CURRENT_DATE, NEXT_DATE)
  }
  isShowDuration() {
    // nếu tin nhắn này không phải của khách gửi thì thôi
    if (this.CURRENT_MESSAGE?.message_type !== 'client') return false

    // nếu có tin tiếp theo, thì phải là tin của page mới tính
    if (!this.NEXT_MESSAGE || this.NEXT_MESSAGE?.message_type !== 'page')
      return false

    // đánh dấu rep chậm
    return true
  }
  isSlowReply() {
    // nếu AI không đánh dấu rep chậm thì thôi
    if (!this.CURRENT_MESSAGE?.is_ai_slow_reply) return

    // nếu có tin tiếp theo, thì phải là tin của page mới tính
    if (this.NEXT_MESSAGE && this.NEXT_MESSAGE?.message_type !== 'page') return

    // đánh dấu rep chậm
    return true
  }
  isWarning() {
    // AI đánh dấu rep chậm, nhưng chưa đủ điều kiện cảnh báo
    return this.CURRENT_MESSAGE?.is_ai_slow_reply && !this.isSlowReply()
  }
}
