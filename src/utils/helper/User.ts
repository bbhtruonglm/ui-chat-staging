import { map, mapValues } from 'lodash'

import type { PageList } from '@/service/interface/app/page'
import type { StaffInfo } from '@/service/interface/app/staff'

/**các tiện ích để xử lý với user, nhân viên */
export class User {
  public static getUsersInfo(
    selected_pages_info?: PageList
  ): Record<string, StaffInfo> {
    /**dữ liệu nhân viên đã được tổng hợp */
    let result: Record<string, StaffInfo> = {}

    // lặp qua các trang đã chọn
    map(selected_pages_info, item => {
      // lấy ra thông tin nhân viên của trang
      result = { ...result, ...mapValues(item?.staff_list) }
    })

    // trả về kết quả
    return result
  }
}
