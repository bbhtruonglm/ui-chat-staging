import { isObject } from 'lodash'
import type { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2'
import Swal from 'sweetalert2'
import { singleton } from 'tsyringe'
import { useToast, type POSITION } from 'vue-toastification'

import CustomToastV2 from '@/components/CustomToastV2.vue'

import type { IAlert } from '@/utils/helper/Alert/type'

/** thông báo dạng toast */
@singleton()
export class Toast implements IAlert {
  /**thời gian toast hiển thị */
  readonly #TIMER: number
  /**vị trí hiển thị toast */
  readonly #POSITION: SweetAlertPosition

  constructor(position: SweetAlertPosition = 'top-end', timer: number = 3000) {
    // thiết lập vị trí hiển thị toast
    this.#POSITION = position
    // thiết lập thời gian toast
    this.#TIMER = timer
  }

  /**kích hoạt thông báo dạng toast */
  #trigger(icon: SweetAlertIcon, message: any): void {
    /**thông điệp đã xử lý */
    const MESSAGE = this.#formatError(message)

    // hiển thị thông báo
    Swal.fire({
      icon,
      title: MESSAGE,
      position: this.#POSITION,
      timer: this.#TIMER,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: (r: HTMLElement) => {
        r.addEventListener('mouseenter', Swal.stopTimer)
        r.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })
  }
  /**format lỗi thành chuỗi */
  #formatError(e: any): string {
    /**nội dung thông báo */
    let message = e?.message || e

    // tự động parser obj thành string
    if (isObject(message)) message = JSON.stringify(message, null, 4)

    // trả về thông báo
    return message
  }

  public success(message: any): void {
    // hiển thị thông báo
    this.#trigger('success', message)
  }
  public error(message: any): void {
    // hiển thị thông báo
    this.#trigger('error', message)
  }
  public warning(message: any): void {
    // hiển thị thông báo
    this.#trigger('warning', message)
  }
  public question(message: any): void {
    // hiển thị thông báo
    this.#trigger('question', message)
  }
}

/** thông báo dạng toast mới */
@singleton()
export class ToastV2 implements IAlert {
  /**kích hoạt thông báo dạng toast */
  #trigger(icon: SweetAlertIcon, message: any, position: string = 'top-right', timer: number|false = false): void {
    /** thông điệp đã xử lý */
    const MESSAGE = this.#formatError(message)

    /** đối tượng toast của thư viện vue-toastification */
    const TOAST = useToast()

    // hiển thị thông báo
    TOAST(
      {
        component: CustomToastV2,
        props: {
          message: MESSAGE,
          type: icon,
        },
      },
      {
        position: position as POSITION,
        timeout: timer,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: false,
        icon: false,
        rtl: false,
      },
    )
  }

  /**format lỗi thành chuỗi */
  #formatError(e: any): string {
    /**nội dung thông báo */
    let message = e?.message || e

    // tự động parser obj thành string
    if (isObject(message)) message = JSON.stringify(message, null, 4)

    // trả về thông báo
    return message
  }
  
  /** thông báo thành công */
  public success(message: any, position?: string, timer?: number): void {
    // hiển thị thông báo
    this.#trigger('success', message, position, timer)
  }

  /** thông báo lỗi */
  public error(message: any, position?: string, timer?: number): void {
    // hiển thị thông báo
    this.#trigger('error', message, position, timer)
  }

  /** hiện cảnh báo */
  public warning(message: any, position?: string, timer?: number): void {
    // hiển thị thông báo
    this.#trigger('warning', message, position, timer)
  }

  /** hiện cảnh báo */
  public question(message: any, position?: string, timer?: number): void {
    // hiển thị thông báo
    this.#trigger('question', message, position, timer)
  }

  /** hiện thông tin */
  public info(message: any, position?: string, timer?: number): void {
    // hiển thị thông báo
    this.#trigger('info', message, position, timer)
  }
}

/**
 * singleton quản lý toast
 * @deprecated sử dụng DI container thay thế
 */
export class ToastSingleton extends Toast implements IAlert {
  /**đối tượng toast */
  static #inst: IAlert

  private constructor() {
    // khởi tạo toast cha bằng các thiết lập mặc định
    super()
  }

  /**lấy đối tượng toast */
  public static getInst(): IAlert {
    // nếu chưa khởi tạo thì khởi tạo
    if (!this.#inst) this.#inst = new this()

    // trả về đối tượng toast đã khởi tạo
    return this.#inst
  }
}
