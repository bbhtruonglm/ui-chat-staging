import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'
import { N4Serivce } from '@/utils/api/N4Serivce'

/**gọi API module page của chatbox */
export class N4SerivceAppUser extends N4Serivce {
  constructor() {
    // gọi API module page của chatbot
    super('app/chatbot_user')
  }

  /**tìm kiếm dữ liệu người dùng */
  public async findUser(user_id: string): Promise<ChatbotUserInfo> {
    // gọi api
    return this.post('read_another_chatbot_user', { user_id })
  }
}
