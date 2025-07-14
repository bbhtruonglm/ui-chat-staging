import { singleton } from 'tsyringe'

/**các phương thức kiểm tra thiết bị*/
export interface IDevice {
  /**kiểm tra thiết bị có phải là điện thoại không*/
  isMobile(): boolean
  /**kiểm tra thiết bị có phải là máy tính bảng không*/
  isTablet(): boolean
  /**kiểm tra thiết bị có phải là máy tính không*/
  isDesktop(): boolean
}

/**các phương thức kiểm tra thiết bị*/
@singleton()
export class Device implements IDevice {
  isMobile() {
    return window.innerWidth < 768
  }

  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024
  }

  isDesktop() {
    return window.innerWidth >= 1024
  }
}
