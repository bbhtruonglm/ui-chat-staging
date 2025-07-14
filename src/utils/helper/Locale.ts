import { CookieSingleton } from '@/utils/base/KVStorage/Cookie'
import { singleton } from 'tsyringe'

import type { IKVStorage } from '@/utils/base/KVStorage/type'

/**interface quản lý locale */
export interface ILocale {
  /**lấy locale */
  get(): string
  /**
   * đặt locale
   * @param value giá trị locale
   */
  set(value: string): void
}

/**quản lý giá trị locale hiện tại */
@singleton()
export class Locale implements ILocale {
  /**cookie quản lý locale */
  readonly #KVS: IKVStorage = CookieSingleton.getInst()
  /**tên cookie */
  readonly #COOKIE_NAME = 'locale'
  /**locale mặc định */
  readonly #DEFAULT_LOCALE = 'vn'

  public get(): string {
    // đọc giá trị locale từ cookie
    return this.#KVS.get(this.#COOKIE_NAME) || this.#DEFAULT_LOCALE
  }
  public set(value: string): void {
    // thiết lập giá trị locale vào cookie
    this.#KVS.set(this.#COOKIE_NAME, value)
  }
}

/**
 * singleton quản lý locale
 * @deprecated
 */
export class LocaleSingleton extends Locale implements ILocale {
  /**đối tượng locale */
  static #inst: ILocale

  private constructor() {
    // khởi tạo locale cha
    super()
  }

  /**lấy đối tượng locale */
  public static getInst(): ILocale {
    // nếu chưa khởi tạo thì khởi tạo
    if (!this.#inst) this.#inst = new this()

    // trả về đối tượng locale đã khởi tạo
    return this.#inst
  }
}
