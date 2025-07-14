import type { PageData } from '@/service/interface/app/page'

/**các hàm hỗ trợ cho trang */
export class Page {
  /**kiểm tra xem user có phải là admin trang không */
  static isCurrentStaffIsPageAdmin(page?: PageData): boolean {
    // nếu không có id tran thì thôi
    if (!page?.page?.fb_page_id) return false

    // nhân viên không có quyền
    if (
      // không nằm trong nhóm admin
      !page?.current_staff?.group_staff?.includes(page?.group_admin_id || '') &&
      // không phải admin của fb
      page?.current_staff?.role !== 'MANAGE'
    )
      return false

    // nhân viên có quyền
    return true
  }
}
