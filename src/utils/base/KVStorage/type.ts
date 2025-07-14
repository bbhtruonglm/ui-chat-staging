/**interface quản lý lưu trữ dạng key-value */
export interface IKVStorage {
  /**
   * đọc dữ liệu
   * @param name tên key
   */
  get(name: string): string | undefined
  /**
   * lưu dữ liệu
   * @param name tên key
   * @param value giá trị
   */
  set(name: string, value: string): void
}
