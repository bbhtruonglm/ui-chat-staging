import { Toast } from './Alert/Toast'
import { i18n } from '@/lang'
import { container, singleton } from 'tsyringe'

import type { IAlert } from './Alert/type'

/**interface quản lý bộ nhớ tạm */
export interface IClipboard {
  /**
   * sao chép text vào bộ nhớ tạm
   * @param text text cần sao chép
   * @param message thông báo sau khi sao chép
   */
  copy(text?: string, message?: string): void
}

/**tiện ích cho bộ nhớ tạm */
@singleton()
export class Clipboard implements IClipboard {
  /**
   * @param ALERT_SERVICE đối tượng thông báo
   * @param I18N_SERVICE đối tượng dịch ngôn ngữ
   */
  constructor(
    private readonly ALERT_SERVICE: IAlert = container.resolve(Toast),
    private readonly I18N_SERVICE = i18n?.global
      ?.t
  ) {}

  copy(text?: string, message?: string): void {
    // nếu không có text thì không làm gì cả
    if (!text) return

    // sao chép text vào bộ nhớ tạm
    navigator.clipboard.writeText(text)

    /**thông điệp đã xử lý */
    const MESSAGE = message || this.I18N_SERVICE('v1.common.copy_to_clipboard')

    // hiển thị thông báo đã sao chép thành công
    this.ALERT_SERVICE.success(MESSAGE)
  }
}
