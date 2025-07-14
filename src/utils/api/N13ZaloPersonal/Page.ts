import { singleton } from 'tsyringe'
import { N13ZaloPersonal } from '../N13ZaloPersonal'

/**gọi API module của chatbox */
@singleton()
export class N13ZaloPersonalAppPage extends N13ZaloPersonal {
  constructor() {
    // gọi API module
    super('app/page')
  }

  /**kết nối tài khoản zalo cá nhân */
  public async syncZaloPersonalPage(org_id?: string): Promise<string> {
    // gọi api
    return this.post('sync_zalo_personal_page', { org_id })
  }
}
