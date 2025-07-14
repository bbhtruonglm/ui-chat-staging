import type { ILabel } from './label'

/**các trạng thái của app được cài */
export type AppInstalledStatus = 'SUCCESS' | 'INIT'
/**vị trí của app được cài */
export type AppInstalledPosition = 'RIGHT' | 'BOTTOM'
/**kích thước của app được cài */
export type AppInstalledSize = 'MINIMUM' | 'MEDIUM' | 'FULL'

/**các quyền có thể tiếp cận được */
export interface AccessRoleInfo {
  /**quyền thông tin cơ bản */
  public_profile?: boolean
  /**quyền tin nhắn */
  conversation_message?: boolean
  /**quyền thông tin khách hàng */
  conversation_contact?: boolean
  /**quyền nhãn */
  conversation_label?: boolean
  /**quyền ghi chú */
  conversation_last_note?: boolean
  /**quyền nhân viên được assign */
  conversation_staff?: boolean
  /**quyền chatbot */
  conversation_chatbot?: boolean
}

/**dữ liệu của 1 app */
export interface AppInfo {
  /**tổng số app được cài */
  install_number: number
  /**các quyền app này cần */
  access_role: AccessRoleInfo
  /**id app */
  _id: string
  /**tên app */
  name: string
  /**url của người tạo ra app này */
  website_offical: string
  /**tên người tạo */
  partner_name: string
  /**url hiển thị iframe */
  url_app: string
  /**chú thích */
  description: string
  /**tài liệu hướng dẫn */
  document: string
  /**url icon */
  icon: string
  /**url dùng để cài app */
  url_auth: string
  /**icon đặc biệt hiển thị ở bottom */
  mini_icon: string
  /**trạng thái của ứng dụng */
  status?: 'APPROVED' | 'REJECT' | 'PRIVATE'
  /**mã bí mật để lấy dữ liệu */
  secret_key?: string
  /**đánh dấu widget này dùng post mess khi update */
  is_post_message?: boolean
}

/**dữ liệu của app được page cài đặt */
export interface AppInstalledInfo {
  /**gắn cờ có hiển thị widget này không (sử dụng để filter) */
  is_hidden?: boolean
  /**gắn cờ có hiển thị widget này không (sử dụng để toogle) */
  is_show?: boolean
  /**link để hiển thị */
  url?: string
  /**id app được cài */
  _id?: string
  /**trạng thái cài */
  status?: AppInstalledStatus
  /**đánh dấu widget này có được kích hoạt hay không */
  active_widget?: boolean
  /**vị trí hiển thị */
  position?: AppInstalledPosition
  /**sắp xếp vị trí */
  index_position?: number
  /**kích cỡ hiển thị */
  app_installed_size?: AppInstalledSize
  /**hiển thị với staff có những nhóm quyền nào */
  access_group?: string[]
  /**các quyền của app */
  access_role_select?: AccessRoleInfo
  /**ẩn ở màn hình pc */
  hide_pc?: boolean
  /**id của app */
  app_id?: string
  /**id của page được cài */
  fb_page_id?: string
  /**dữ liệu của app */
  snap_app?: AppInfo
  /**token được tạo kém nếu có */
  access_token?: string
}

/**đầu vào api tạo token cho widget */
export interface InputCreateTokenWidget {
  /**id trang */
  page_id: string
  /**danh sách id các widget */
  list_app_installed_id: {
    // app_installed_id: app_id
    [index: string]: string
  }
  /**dữ liệu client muốn thêm vào token */
  payload: {
    /**id khách hàng */
    fb_client_id?: string
    /**tên trang */
    page_name?: string
    /**id nv hiện tại đang chat */
    current_staff_id?: string
    /**tên nv hiện tại đang chat */
    current_staff_name?: string
    /**dữ liệu của các nhãn của hội thoại này */
    label_data?: ILabel[]
    /**id tổ chức hiện tại */
    org_id?: string
  }
}

/**dữ liệu được widget truyền sang */
export interface WidgetEventData {
  /**nội dung văn bản thay vào input */
  content?: string
  /**danh sách hình ảnh */
  list_images?: string[]
  /**được gửi từ widget */
  _type?: 'WIDGET'
}

/**đầu vào api danh sách widget trên chợ */
export interface InputMarketWidget {
  status?: 'APPROVED'
  _type?: 'marketplace'
  skip?: number
  limit?: number
  sort?: string
  search?: string
  /**id người tạo */
  user_created?: string
}

/**gắn cờ trang đã cài đặt hay chưa */
export interface ListPageIsInstall {
  [index: string]: {
    is_installed?: boolean
  }
}
/**đầu vào api kiểm tra trang đã cài đặt widget hay chưa */
export interface InputCheckPageInstallWidget {
  _type: 'check-page-is-installed-app'
  app_id: string
  list_page: ListPageIsInstall
}

/**đầu vào api cài đặt widget */
export interface InputInstallWidget {
  app_id: string
  fb_page_id: string
  position: AppInstalledPosition
  app_installed_size: AppInstalledSize
  access_role_select: {
    [index: string]: boolean
  }
  access_group: string[]
  hide_pc: boolean
}
/**đầu ra api cài đặt widget */
export interface ResponseInstallWidget {
  access_token: string
}

/**đầu vào api lấy danh sách widget đã cài đặt và token */
export interface InputGetInstalledWidget {
  _type: 'short-time-token'
  skip?: number
  limit?: number
  fb_page_id: string
}
/**đầu vào api cài đặt widget */
export interface InputUpdateWidget {
  _id: string
  active_widget?: boolean
  /**vị trí hiển thị */
  position?: AppInstalledPosition
  /**kích cỡ hiển thị */
  app_installed_size?: AppInstalledSize
  /**hiển thị với staff có những nhóm quyền nào */
  access_group?: string[]
  /**các quyền của app */
  access_role_select?: AccessRoleInfo
  /**ẩn ở màn hình pc */
  hide_pc?: boolean
  /** Vị trí hiển thị trên màn hình */
  index_position?: number
}

/**đầu vào api tạo mới ứng dụng */
export interface InputCreateWidget {
  name?: string
  partner_name?: string
  url_app?: string
  url_auth?: string
  icon?: string
  mini_icon?: string
  description?: string
  document?: string
  access_role?: AccessRoleInfo
  user_created?: string
  fb_as_id?: string

  category_id?: string
  email?: string
  phone?: string
  website_offical?: string
  partner_icon?: string
  /**đánh dấu widget này dùng post mess khi update */
  is_post_message?: boolean
}

/**đầu vào api cập nhật ứng dụng */
export interface InputUpdateMyWidget extends InputCreateWidget {
  _id: string
  _type?: 'tranfer'
}

/**danh mục widget */
export interface WidgetCategoryInfo {
  /**tiêu đề */
  title?: string
}
