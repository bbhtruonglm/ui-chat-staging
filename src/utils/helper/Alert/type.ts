/**interface quản lý thông báo */
export interface IAlert<T = any> {
  /**thông báo thành công */
  success(...arg: any[]): T
  /**thông báo lỗi */
  error(...arg: any[]): T
  /**cảnh báo người dùng */
  warning(...arg: any[]): T
  /**hỏi người dùng có chắc chắn không */
  question(...arg: any[]): T
}
