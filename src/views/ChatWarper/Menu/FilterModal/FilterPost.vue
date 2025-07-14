<template>
  <Popover
    ref="filter_popover_ref"
    :is_fit="false"
    width="450px"
    height="auto"
    position="RIGHT"
    :back="400"
  >
    <Post
      :get-post-list="() => $main.getPostList()"
      v-model:posts="posts"
      v-model:filter_keys="filter_keys"
      v-model:search_post_id="search_post_id"
    />
  </Popover>
  <Dropdown
    ref="filter_dropdown_ref"
    :is_fit="false"
    width="450px"
    height="570px"
    position="RIGHT"
    :back="400"
  >
    <Post
      :get-post-list="() => $main.getPostList()"
      v-model:posts="posts"
      v-model:filter_keys="filter_keys"
      v-model:search_post_id="search_post_id"
    />
  </Dropdown>
</template>
<script setup lang="ts">
import { useConversationStore, usePageStore } from '@/stores'
import { N4SerivceAppPost } from '@/utils/api/N4Service/Post'
import { keys } from 'lodash'
import { container } from 'tsyringe'
import { onMounted, ref } from 'vue'

import Dropdown from '@/components/Dropdown.vue'
import Popover from '@/components/Popover.vue'
import Post from '@/views/ChatWarper/Menu/FilterModal/Content/Post.vue'

import { omit } from 'lodash'
import { watch } from 'vue'



import type { IPost } from '@/service/interface/app/message'

/** Interface của bài post */
interface IFilterPost extends IPost {
  /** Trạng thái đã được chọn hay chưa */
  is_selected?: boolean
}

const pageStore = usePageStore()
const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<InstanceType<typeof Popover>>()

/**ref của dropdown */
const filter_dropdown_ref = ref<InstanceType<typeof Dropdown>>()

/** Danh sách bài post */
const posts = ref<IFilterPost[]>([])
/** Biến tạm lưu id bài đăng cần tìm kiếm */
const search_post_id = ref<string>('')
/** Biến tạm lưu giá trị bộ lọc */
const filter_keys = ref<{ [index: string]: string }>({
  is_reply: conversationStore.option_filter_page_data.is_reply || '',
  have_email: conversationStore.option_filter_page_data.have_email || '',
  have_phone: conversationStore.option_filter_page_data.have_phone || '',
  is_private_reply:
    conversationStore.option_filter_page_data.is_private_reply || '',
})

onMounted(() => $main.getPostList())

/** lắng nghe khi clear filter */
watch(
  () => conversationStore.option_filter_page_data.post_id,
  value => {
    // nếu có giá trị thì thôi
    if (value) return

    // loại bỏ gắn cờ
    cancelFilter()
  }
)

/** Xoá lọc */
function clearThisFilter() {
  cancelFilter()
}
/** Hủy lọc */
function cancelFilter() {
  // filter_keys.value = {
  //   is_reply: '',
  //   have_email: '',
  //   have_phone: '',
  //   is_private_reply: '',
  //   post_id: '',
  // }

  /** các trường sẽ bị xóa */
  const DELETE_FIELDS = [
    'is_reply',
    'have_email',
    'have_phone',
    'is_private_reply',
    'post_id',
    'time_range',
  ]

  // Xóa bộ lọc của bài post
  conversationStore.option_filter_page_data = omit(
    conversationStore.option_filter_page_data,
    DELETE_FIELDS
  )

  // cập nhật lại giá trj lưu tạm của bộ lọc
  filter_keys.value = omit(
    filter_keys.value,
    DELETE_FIELDS
  )

  // conversationStore.option_filter_page_data = {
  //   ...conversationStore.option_filter_page_data,
  //   ...filter_keys.value,
  //   ...{ post_id: '', time_range: undefined },
  // }

  posts.value = posts.value.map(item => {
    item.is_selected = false
    return item
  })
}

class Main {
  /**
   * @param API_POST API lấy danh sách bài post
   */
  constructor(
    private readonly API_POST = container.resolve(N4SerivceAppPost)
  ) {}
  /** Lấy danh sách bài post */
  async getPostList() {
    // * Gọi api lấy danh sách post
    posts.value = await this.API_POST.getPosts(
      { $in: keys(pageStore.selected_page_id_list) },
      0,
      5,
      search_post_id.value
    )

    /**id bài viết đã được chọn trước đó */
    const POST_ID = conversationStore.option_filter_page_data.post_id

    // * Check từng bài post xem đã đươc đánh dấu hay chưa?
    posts.value = posts.value.map(post => {
      /** Nếu bài post được chọn thì đánh dấu là active */
      if (POST_ID?.includes(post?.post_id || '')) post.is_selected = true

      // Trả về bài post đã được đánh dấu
      return post
    })
  }
}
const $main = new Main()

defineExpose({ filter_popover_ref, filter_dropdown_ref, clearThisFilter })
</script>
