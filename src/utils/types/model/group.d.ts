/**nhóm của tổ chức */
interface IGroup {
  /**id nhóm */
  group_id?: string
  /**id tổ chức */
  org_id?: string
  /**tên nhóm */
  group_name?: string
  /**danh sách trang */
  group_pages?: string[]
  /**danh sách nhân viên */
  group_staffs?: string[]
}
