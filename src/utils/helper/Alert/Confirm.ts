import Swal from 'sweetalert2'

import type { IAlert } from '@/utils/helper/Alert/type'
import type { SweetAlertIcon } from 'sweetalert2'

/**kết quả sau khi confirm */
type ConfirmResult = Promise<boolean>

/**hỏi người dùng có chắc chắn muốn thực hiện không */
export class Confirm implements IAlert<Promise<boolean>> {
  /**kích hoạt thông báo dạng confirm */
  async #trigger(
    icon: SweetAlertIcon,
    title: string,
    description?: string
  ): ConfirmResult {
    /**kết quả xác minh */
    const { isConfirmed: IS_CONFIRM } = await Swal.fire({
      title,
      text: description,
      icon,
      showCancelButton: true,
    })

    // trả về kết quả xác minh
    return IS_CONFIRM
  }

  public async success(title: string, description?: string): ConfirmResult {
    // hiển thị thông báo
    return this.#trigger('success', title, description)
  }
  public async error(title: string, description?: string): ConfirmResult {
    // hiển thị thông báo
    return this.#trigger('error', title, description)
  }
  public async warning(title: string, description?: string): ConfirmResult {
    // hiển thị thông báo
    return this.#trigger('warning', title, description)
  }
  public async question(title: string, description?: string): ConfirmResult {
    // hiển thị thông báo
    return this.#trigger('question', title, description)
  }
}

/**singleton quản lý confirm */
export class ConfirmSingleton extends Confirm implements IAlert {
  /**đối tượng confirm */
  static #inst: IAlert

  private constructor() {
    // khởi tạo confirm cha
    super()
  }

  /**lấy đối tượng confirm */
  public static getInst(): IAlert {
    // nếu chưa khởi tạo thì khởi tạo
    if (!this.#inst) this.#inst = new this()

    // trả về đối tượng confirm đã khởi tạo
    return this.#inst
  }
}
