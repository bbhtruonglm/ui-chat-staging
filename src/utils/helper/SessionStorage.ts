import { singleton } from 'tsyringe'

/**quản lý session của trang */
export interface SessionStorage {
  /**
   * lấy item từ session
   * @param key key của item
   * @param default_value giá trị mặc định nếu không tìm thấy
   * @param prefix tiền tố của key
   */
  getItem<T = any>(key: string, default_value?: T, prefix?: string): T
  /**
   * lưu item vào session
   * @param key key của item
   * @param value giá trị cần lưu
   * @param prefix tiền tố của key
   */
  setItem<T = any>(key: string, value: T, prefix?: string): void
}

/**quản lý session của trang */
@singleton()
export class SessionStorageManager implements SessionStorage {
  getItem<T = any>(
    key: string,
    default_value?: T,
    prefix: string = $env.session_storage?.prefix || ''
  ) {
    try {
      /**lấy dữ liệu từ session */
      const DATA = sessionStorage.getItem(`${prefix}${key}`)

      // trả về giá trị mặc định nếu không có dữ liệu
      if (DATA === null) return default_value

      // nếu có dữ liệu thì trả về dữ liệu đã parse
      if (DATA) return JSON.parse(DATA)
    } catch (e) {
      // nếu có lỗi thì thôi
    }
  }

  setItem(
    key: string,
    value: any,
    prefix: string = $env.session_storage?.prefix || ''
  ): void {
    // lưu dữ liệu vào session
    sessionStorage.setItem(`${prefix}${key}`, JSON.stringify(value))
  }
}
