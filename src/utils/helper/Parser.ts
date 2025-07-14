import { singleton } from 'tsyringe'

/**các tiện ích liên quan đến định dạng dữ liệu */
export interface IParser {
  /**chuyển đổi object thành dạng query string trên url */
  toQueryString(payload: Record<string, any>): string
}

/**các tiện ích liên quan đến định dạng dữ liệu */
@singleton()
export class Parser implements IParser {
  /**@deprecated chuyển đổi object thành dạng query string trên url */
  static toQueryString(payload: Record<string, any>): string {
    return new URLSearchParams(payload).toString()
  }

  toQueryString(payload: Record<string, any>) {
    // xử lý dữ liệu
    return new URLSearchParams(payload).toString()
  }
}
