import type { ILabel } from '@/service/interface/app/label'

/**dữ liệu nhãn đã được chỉnh sửa */
export interface ICustomLabel extends ILabel {
  /**nhãn có được chọn không */
  is_active?: number
}
