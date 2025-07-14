import type { AppInfo } from '@/service/interface/app/widget'
import { Botx } from '@/utils/api/Botx'
import { mapKeys } from 'lodash'

/**gọi API lên server n5 của chatbox */
export class N5AppV1 extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbox
    super(`${$env.host.n5_app_v1}/v1/${path}`)
  }
}

/**gọi API module app widget của chatbox */
export class N5AppV1AppApp extends N5AppV1 {
  constructor() {
    // gọi API module page của chatbot
    super('app/app')
  }

  /**đính kèm id trang lên toàn bộ API */
  public async readMarket(
    skip = 0,
    limit = 200
  ): Promise<Record<string, AppInfo>> {
    /**gọi API lấy danh sách các ứng dụng trên chợ */
    const { app: APPS } = await this.post('read', {
      status: 'APPROVED',
      _type: 'marketplace',
      skip,
      limit,
    })

    // chuyển dữ liệu về dạng key-value
    return mapKeys(APPS, '_id')
  }
}
