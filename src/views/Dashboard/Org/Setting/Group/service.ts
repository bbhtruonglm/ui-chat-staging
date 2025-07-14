import { filter, keyBy, keys, mapValues } from 'lodash'
import { singleton } from 'tsyringe'

/**dịch vụ của nhóm */
export function groupService() {
  /**dịch vụ của nhóm */
  @singleton()
  class GroupService {
    /**lọc ra các id được chọn */
    getSelectedIds(map: Record<string, boolean>): string[] {
      return filter(keys(map), key => map[key])
    }
    /**chuyển id dạng mảng thành dạng map */
    setSelectedIds(items?: string[]): Record<string, boolean> {
      return mapValues(keyBy(items), n => true)
    }
  }

  return { GroupService }
}
