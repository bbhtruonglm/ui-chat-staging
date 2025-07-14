import JsCookie from 'js-cookie'

import type { IKVStorage } from './type'

/**quản lý cookie của ứng dụng */
export class Cookie implements IKVStorage {
  public get(name: string): string | undefined {
    // trả về giá trị của cookie
    return JsCookie.get(name)
  }
  public set(name: string, value: string): void {
    // thiết lập giá trị của cookie
    JsCookie.set(name, value)
  }
}

/**singleton quản lý cookie */
export class CookieSingleton extends Cookie implements IKVStorage {
  /**đối tượng cookie */
  static #inst: IKVStorage

  private constructor() {
    // khởi tạo cookie cha
    super()
  }

  /**lấy đối tượng cookie */
  public static getInst(): IKVStorage {
    // nếu chưa khởi tạo thì khởi tạo
    if (!this.#inst) this.#inst = new this()

    // trả về đối tượng cookie đã khởi tạo
    return this.#inst
  }
}
