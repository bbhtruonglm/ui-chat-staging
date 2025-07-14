/**các tiện ích liên quan đến tên miền */
export class Domain {
  /**tên miền */
  static HOST_NAME = location.hostname

  /**trang có đang deploy ở domain không? */
  static #isDomain(domain: string) {
    return this.HOST_NAME.includes(domain)
  }

  /**trang có đang deploy ở retion.ai không? */
  static isRetion() {
    return this.#isDomain('retion.ai')
  }
}