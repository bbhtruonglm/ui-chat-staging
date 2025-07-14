import { N4Serivce } from '@/utils/api/N4Serivce'

/**tài khoản ngân hàng */
export interface IBankAccount {
  /**Mã ngân hàng */
  bank_bin?: number
  /**Số tài khoản */
  account?: string
  /**Tên chủ tài khoản */
  name?: string
  /**Tên ngân hàng */
  bank?: string
  /**định danh ngân hàng từ BE */
  code?: string
}
/**liên kết ngoại vi */
export interface IExternalLink {
  /**thiết lập trang */
  setting?: string
  /**thống kê trang */
  analytic?: string
  /**chatbot */
  chatbot?: string
  /**chatbox */
  chatbox?: string
  /**trang download uid */
  download?: string
  /**trang merchant */
  merchant?: string
  /**trang quản trị */
  admin?: string
}
/**đối tác */
export interface IPartner {
  /**tên miền của đối tác */
  domain?: string
  /**tên của đối tác */
  name?: string
  /**logo */
  logo?: {
    /**logo chỉ icon */
    icon?: string
    /**logo đầy đủ: icon + text */
    full?: string
  }
  /**thông tin chuyển khoản ngân hàng */
  bank_account?: {
    /**tài khoản ngân hàng xuất hóa đơn */
    invoice?: IBankAccount
    /**tài khoản ngân hàng không xuất hóa đơn */
    non_invoice?: IBankAccount
  }
  /**mã code cho tính năng sao chép thiết lập */
  code_copy_page_setting?: string
  /**email hỗ trợ */
  support_email?: string
  /**liên kết ngoại vi */
  external_link?: IExternalLink
}

/**gọi API của partner */
export class N4SerivcePublicPartner extends N4Serivce {
  constructor() {
    super(`public/partner`)
  }

  /**lấy dữ liệu của đối tác hiện tại */
  public async readPartner(): Promise<IPartner> {
    // gọi api
    return this.post('read_partner')
  }
}
