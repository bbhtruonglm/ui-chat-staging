<template>
  <PostAnalytic class="bg-white md:w-[400px] md:mx-auto" />
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { container } from 'tsyringe'
import { useConversationStore } from '@/stores'
import { N4SerivceAppPost } from '@/utils/api/N4Service/Post'

import PostAnalytic from '@/views/ChatWarper/Chat/RightBar/PostAnalytic.vue'

const $route = useRoute()
const conversationStore = useConversationStore()

/**id trang */
const page_id = ref($route.query.page_id as string)
/**id khách hàng */
const client_id = ref($route.query.client_id as string)

class Main {
  /**
   * @param API_POST API lấy dữ liệu bài viết
   */
  constructor(
    private readonly API_POST = container.resolve(N4SerivceAppPost)
  ) {}

  /**load dữ liệu thống kê bài viết */
  async loadPostConversationData() {
    // nếu không có id cuộc trò chuyện thì thôi
    if (!page_id.value || !client_id.value) return

    /**lấy dữ liệu bài post */
    conversationStore.select_conversation_post = await this.API_POST.getPost(
      page_id.value,
      client_id.value
    )
  }
}
const $main = new Main()

// load dữ liệu thống kê bài viết khi component được mount
onMounted(() => $main.loadPostConversationData())
</script>
