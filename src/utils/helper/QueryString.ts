import { singleton } from 'tsyringe'

/**xử lý query string */
export interface IQueryString {
  /**
   * lấy giá trị của 1 key trong query string
   * @param url_query chuỗi query string cần xử lý
   * @param key key cần lấy giá trị
   */
  get(key: string, url_query?: string): string | null
  /**
   * lấy tất cả query string
   * @param url_query chuỗi query string cần xử lý
   */
  getAll(url_query?: string): Record<string, string>
  /**
   * chuyển dữ liệu thành query string
   * @param input dữ liệu cần chuyển thành query string
   */
  toString(input?: Record<string, any>): string
}

/**xử lý query string */
@singleton()
export class QueryString implements IQueryString {
  get(key: string, url_query: string = location.search) {
    return new URLSearchParams(url_query).get(key)
  }
  getAll(url_query: string = location.search) {
    return new URLSearchParams(url_query) as unknown as Record<string, string>
  }
  toString(input?: Record<string, any>) {
    return new URLSearchParams(input).toString()
  }
}
