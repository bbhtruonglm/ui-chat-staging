<template>
  <Modal
    @close_modal="$main.onCloseModal()"
    ref="modal_ref"
    class_header="!text-base"
    class_modal="h-3/4 gap-2"
    class_body="py-2 flex gap-3 w-[602px] bg-white rounded-lg p-2 flex flex-col relative"
  >
    <template v-slot:header>
      {{ $t('Xem bình luận bài viết') }}
    </template>
    <template v-slot:body>
      <div
        v-if="is_loading"
        class="absolute top-2 left-1/2 -translate-x-1/2"
      >
        <Loading />
      </div>
      <div class="flex gap-2 p-2 flex-col">
        <PostInfo
          :message
          :message_index
        />
        <MainComment
          :message
          :message_index
          v-model:is_loading="is_loading"
        />
      </div>
      <div class="overflow-y-auto flex flex-col gap-3">
        <CommentItem
          v-for="(comment, comment_index) in post_comments"
          v-model:main_loading="is_loading"
          :post_id
          :comment
          :comment_index
          class="px-3"
        />
        <LoadMoreBtn
          v-if="!done_load_comment"
          @click="$main.getFbPostComments()"
          class="pl-3"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConversationStore } from '@/stores'
import { composableService } from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/service'

import MainComment from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/MainComment.vue'
import Modal from '@/components/Modal.vue'

import Loading from '@/components/Loading.vue'
import PostInfo from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/PostInfo.vue'
import LoadMoreBtn from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/CommentModal/LoadMoreBtn.vue'

import CommentItem from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/CommentModal/CommentItem.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { FacebookCommentPost } from '@/service/interface/app/post'
import type { CbError } from '@/service/interface/function'
import type { MessageInfo } from '@/service/interface/app/message'
import { error } from '@/utils/decorator/Error'
import { container } from 'tsyringe'
import { loadingV2 } from '@/utils/decorator/Loading'
import { N4SerivceAppPost } from '@/utils/api/N4Service/Post'

const { ToastReplyComment } = composableService()

const $props = withDefaults(
  defineProps<{
    /**id của bài post */
    post_id: string
    /**dữ liệu tin nhắn */
    message?: MessageInfo
    /**vị trí của tin nhắn */
    message_index?: number
  }>(),
  {}
)

const conversationStore = useConversationStore()

/**giới hạn số bản ghi */
const LIMIT_RECORD = 3

/** Ref của modal */
const modal_ref = ref<ComponentRef>()
/** Comments trong bài post */
const post_comments = ref<FacebookCommentPost[]>([])
/** gắn cờ đã load hết bình luận chính */
const done_load_comment = ref<boolean>()
/**phân trang bình luận chính */
const skip_comment = ref(0)
/**bật loading */
const is_loading = ref(false)

/**id của page */
const page_id = computed(
  () => conversationStore.select_conversation?.fb_page_id
)
/**id của client */
const client_id = computed(
  () => conversationStore.select_conversation?.fb_client_id
)

class Main {
  /**
   * @param API_POST API của bài post
   */
  constructor(
    private readonly API_POST = container.resolve(N4SerivceAppPost)
  ) {}

  /**xoá dữ liệu khi modal tắt */
  onCloseModal() {
    // danh sách bình luận
    post_comments.value = []

    // phân trang bình luận
    skip_comment.value = 0

    // cờ đã load hết bình luận
    done_load_comment.value = false

    // tắt loading
    is_loading.value = false
  }
  /** Dùng để bật modal */
  toggleModal() {
    // lấy dữ liệu bình luận chính
    this.getFbPostComments()

    // bật modal
    modal_ref.value?.toggleModal()
  }
  /** Lấy bình luận chính từ bài post của fb */
  @loadingV2(is_loading, 'value')
  @error(container.resolve(ToastReplyComment))
  async getFbPostComments() {
    // xác thực dữ liệu
    if (!page_id.value || !client_id.value) return

    /**dữ liệu bình luận */
    const COMMENTS = await this.API_POST.getMainComment(
      page_id.value,
      client_id.value,
      $props.post_id,
      skip_comment.value,
      LIMIT_RECORD
    )

    // kiểm tra xem đã load hết bình luận chưa
    if ((COMMENTS?.length || 0) < LIMIT_RECORD) done_load_comment.value = true

    // thêm dữ liệu vào mảng
    post_comments.value.push(...COMMENTS)

    // tăng số bản ghi
    skip_comment.value += LIMIT_RECORD
  }
}
const $main = new Main()

defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
<style lang="scss" scoped>
@import '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/style.scss';
</style>
