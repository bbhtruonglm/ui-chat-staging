import { Botx } from '@/utils/api/Botx'

/**gọi API lên server n8 v2 của chatbox */
class N8Merge extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbox
    super(`${$env.host.n8_merge_v2}/${path}`)

    // tự động nạp id tổ chức đang chọn
    this.initSelectedOrgId()
  }
}

/**gọi API lên module của app */
class N8MergeApp extends N8Merge {
  constructor(path: string) {
    // gọi API lên module của app
    super(`app/${path}`)
  }

  /**gọi api post lên app */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, {
      org_id: this.org_id,
      ...body,
    })
  }
}

/**gọi API trang */
export class N8MergeAppPage extends N8MergeApp {
  constructor() {
    // gọi lớp cha
    super(`page`)
  }

  /**đọc dữ liệu thống kê gốc */
  async copyPageSetting(
    /**code trang gốc */
    from_code: string,
    /**id trang đích */
    to_page_ids: string[],
    /**các field muốn chọn */
    select?: string[]
  ): Promise<void> {
    // gọi API
    return this.post('copy_page_setting', {
      from_code,
      to_page_ids,
      select,
    })
  }
}
