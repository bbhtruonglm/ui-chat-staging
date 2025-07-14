/**
 * Giao diện đại diện cho nội dung của một modal nâng cấp.
 */
export interface IContent {
  /**Tiêu đề của nội dung. */
  title: string
  /**Giá liên quan đến nội dung. */
  price: string
  /** tương tương 1 năm không giảm giá */
  price_year?: string
  /**Giá giảm giá liên quan đến nội dung. */
  price_discount?: string
  /**tương đương 1 năm */
  price_discount_year?: string
  /**Thông tin trang liên quan đến nội dung. */
  page: string
  /**Số lượng thành viên bao gồm trong nội dung. */
  member: string
  /**Khả năng văn bản AI bao gồm trong nội dung. */
  ai_text: string
  /**Khả năng hình ảnh AI bao gồm trong nội dung. */
  ai_image: string
  /**Khả năng âm thanh AI bao gồm trong nội dung. */
  ai_sound: string
  /**Đơn vị truy cập tính năng (FAU) liên quan đến nội dung. */
  fau: string
  /**Thông tin khách hàng liên quan */
  client: string
  /**Tính năng chat. */
  chat_feature: string
  /**Tính năng AI. */
  ai_feature: string
  /**Tên công ty. */
  company_name: string
  /**Tích hợp API. */
  api_integrate: string
  /**Logo miền. */
  domain_logo: string
  /**Hỗ trợ. */
  support: string
}
