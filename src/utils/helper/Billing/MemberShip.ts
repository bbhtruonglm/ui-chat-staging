import { add_ms } from '@/service/api/chatbox/billing'
import type { MemberShipInfo } from '@/service/interface/app/billing'

/**các hàm hỗ trợ cho billing */
export interface IMemberShipHelper {
  /**
   * kiểm tra user có phải là admin không
   * @param ms thông tin membership
   */
  isAdmin(ms?: MemberShipInfo): boolean
  /**
   * kiểm tra user có phải là admin đang kích hoạt không
   * @param ms thông tin membership
   */
  isActiveAdmin(ms?: MemberShipInfo): boolean
  /**
   * kiểm tra user có phải là staff không
   * @param ms thông tin membership
   */
  isStaff(ms?: MemberShipInfo): boolean
  /**
   * kiểm tra user có phải là staff đang kích hoạt không
   */
  isActiveStaff(ms?: MemberShipInfo): boolean
  /**kích hoạt nhân viên đang chờ */
  activeStaff(ms?: MemberShipInfo): Promise<void>
}

/**các hàm hỗ trợ cho billing */
export class MemberShipHelper implements IMemberShipHelper {
  isAdmin(ms?: MemberShipInfo) {
    // là admin
    return Boolean(ms?.ms_role === 'ADMIN')
  }
  isActiveAdmin(ms?: MemberShipInfo) {
    // là admin và đang kích hoạt
    return Boolean(ms?.ms_role === 'ADMIN' && ms?.ms_is_active)
  }
  isStaff(ms?: MemberShipInfo) {
    // là staff
    return Boolean(ms?.ms_role === 'STAFF')
  }
  isActiveStaff(ms?: MemberShipInfo) {
    // là staff và đang kích hoạt
    return Boolean(ms?.ms_role === 'STAFF' && ms?.ms_is_active)
  }
  async activeStaff(ms?: MemberShipInfo) {
    // không có thông tin membership thì thôi
    if (!ms?.org_id || !ms?.staff_id) return

    // gọi api thêm lại nhân viên 1 lần nữa
    await add_ms(ms?.org_id, ms?.staff_id, ms?.ms_role)
  }
}

/**các hàm hỗ trợ cho billing */
export class SingletonMemberShipHelper extends MemberShipHelper {
  /**đối tượng duy nhất */
  private static inst: IMemberShipHelper

  // chặn khởi tạo từ bên ngoài
  private constructor() {
    super()
  }

  /**lấy đối tượng duy nhất */
  static getInst() {
    // nếu chưa có thì tạo mới
    if (!this.inst) this.inst = new this()

    // trả về đối tượng
    return this.inst
  }
}
