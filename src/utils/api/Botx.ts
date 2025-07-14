import { getItem } from '@/service/helper/localStorage'
import { ApiManager } from '@/utils/base/Api'
import { useOrgStore } from '@/stores'

/**gọi API lên server của botx, tự động nạp token */
export class Botx extends ApiManager {
  /**id tổ chức đang chọn */
  public org_id?: string

  constructor(uri: string) {
    // tự động nạp token
    super(uri, { Authorization: getItem('access_token') })
  }

  /**lấy id của tổ chức đang được chọn */
  protected initSelectedOrgId() {
    /**lấy store tổ chức */
    const orgStore = useOrgStore()

    // nạp id tổ chức
    this.org_id = orgStore.selected_org_id
  }
}
