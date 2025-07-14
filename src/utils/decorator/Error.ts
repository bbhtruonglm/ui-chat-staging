import { container } from 'tsyringe'
import { Toast } from '../helper/Alert/Toast'

import type { IAlert } from '../helper/Alert/type'

/**
 * hàm trang trí tính năng bắt và cảnh báo lỗi cho phương thức
 * @param service_alert service cảnh báo lỗi
 * @param callback callback sau khi cảnh báo
 * @param is_continue có tiếp tục ném lỗi sau khi cảnh báo hay không
 */
export function error(
  service_alert: IAlert = container.resolve(Toast),
  callback?: Function,
  is_continue = false
) {
  return function (
    target: any,
    property_key: string,
    descriptor: PropertyDescriptor
  ) {
    /**phương thức gốc */
    const ORIGINAL_METHOD = descriptor.value

    // trang trí phương thức
    descriptor.value = async function (...args: any[]) {
      try {
        // chạy phương thức gốc
        await ORIGINAL_METHOD.apply(this, args)
      } catch (e) {
        // bắt lỗi và cảnh báo
        service_alert.error(e)

        // chạy callback nếu có
        if (callback) await callback(e)

        // tiếp tục ném lỗi nếu cần
        if (is_continue) throw e
      }
    }

    // trả về phương thức đã trang trí
    return descriptor
  }
}
