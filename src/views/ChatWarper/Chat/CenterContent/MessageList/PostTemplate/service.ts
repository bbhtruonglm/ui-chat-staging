import { useConversationStore } from '@/stores'
import { N4SerivceAppPost } from '@/utils/api/N4Service/Post'
import { container, singleton } from 'tsyringe'
import { Toast } from '@/utils/helper/Alert/Toast'
import { useI18n } from 'vue-i18n'

import type { IPost, MessageInfo } from '@/service/interface/app/message'
import type { IAlert } from '@/utils/helper/Alert/type'
import { WindowAction, type IWindowAction } from '@/utils/helper/Navigation'

/**dịch vụ của bài post */
export function composableService() {
  const conversationStore = useConversationStore()
  const { t: $t } = useI18n()

  /**dịch vụ của bài post */
  @singleton()
  class PostService {
    /**
     * @param API_POST API của bài post
     * @param SERVICE_WINDOW_ACTION dịch vụ của cửa sổ
     */
    constructor(
      private readonly API_POST = container.resolve(N4SerivceAppPost),
      private readonly SERVICE_WINDOW_ACTION: IWindowAction = container.resolve(
        WindowAction
      )
    ) {}

    /**ẩn bình luận */
    async toggleComment(type: 'HIDE' | 'SHOW', message?: MessageInfo) {
      // kiểm tra dữ liệu
      if (!conversationStore.select_conversation?.fb_page_id) return
      if (!conversationStore.select_conversation?.fb_client_id) return
      if (!message?.fb_post_id) return
      if (!message?.comment_id) return

      /**trạng thái ẩn bình luận */
      const IS_HIDDEN = type === 'HIDE' ? true : false

      // ẩn hoặc hiện bình luận
      await this.API_POST.toggleComment(
        conversationStore.select_conversation?.fb_page_id,
        conversationStore.select_conversation?.fb_client_id,
        message?.fb_post_id,
        message?.comment_id,
        IS_HIDDEN
      )

      // cập nhật lại trạng thái bình luận
      message.is_hidden_comment = IS_HIDDEN
    }
    /**tên người tạo bài viết */
    getCreatorName(post?: IPost) {
      return (
        post?.creator_name ||
        post?.content?.admin_creator?.name ||
        post?.content?.from?.name
      )
    }
    /**mở bài viết ở vị trí comment này */
    openCommentOnFb(post_id?: string, comment_id?: string) {
      /**id mục tiêu */
      const TARGET_ID = comment_id || post_id

      // mở tab mới
      this.SERVICE_WINDOW_ACTION.openNewTab(`https://fb.com/${TARGET_ID}`)
    }
  }

  /**custom lại thông báo lỗi */
  @singleton()
  class ToastReplyComment extends Toast implements IAlert {
    public error(message: any): void {
      // lỗi đã ẩn bình luận rồi
      if (message?.error_subcode === 1446036)
        message = $t('Bình luận đã được ẩn rồi')

      // lỗi đã trả lời rồi
      if (message?.code === 10900)
        message = $t('v1.view.main.dashboard.chat.post.already_replied')

      // thông báo lỗi
      super.error(message)
    }
  }

  // trả về dữ liệu
  return { PostService, ToastReplyComment }
}
