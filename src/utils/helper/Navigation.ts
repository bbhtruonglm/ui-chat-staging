import { singleton } from 'tsyringe'

/**@deprecated các tiện ích liên quan đến chuyển hướng trang web */
export class Navigation {
  /**mở url trong một tab mới */
  static openNewTab(url?: string): void {
    // nếu không có url thì thôi
    if (!url) return

    // mở tab mới
    window.open(url, '_blank')
  }
}

/**các tiện ích liên quan đến cửa sổ trình duyệt */
export interface IWindowAction {
  /**chuyển hướng đến url */
  redirect(url?: string): void
  /**mở url trong một tab mới */
  openNewTab(url?: string): void
  /**mở url trong một popup */
  openPopup(url?: string, width?: number, height?: number): void
}

/**các tiện ích liên quan đến cửa sổ trình duyệt */
@singleton()
export class WindowAction implements IWindowAction {
  redirect(url?: string): void {
    // nếu không có url thì thôi
    if (!url) return

    // chuyển hướng
    window.location.href = url
  }
  openNewTab(url?: string): void {
    // nếu không có url thì thôi
    if (!url) return

    // mở tab mới
    window.open(url, '_blank')
  }
  openPopup(url?: string, width?: number, height?: number): void {
    // nếu không có url thì thôi
    if (!url) return

    // mở popup
    window.open(url, '_blank', `width=${width}, height=${height}`)
  }
}
