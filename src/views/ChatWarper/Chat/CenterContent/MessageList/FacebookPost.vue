<template>
  <div
    v-if="is_get_post_success"
    class="max-w-96 bg-white rounded-lg p-2 flex flex-col gap-2 relative"
  >
    <Loading
      v-if="is_loading"
      type="FULL"
    />
    <div class="text-xxs">
      {{ $t('v1.view.main.dashboard.chat.post.post_by') }}
      <span class="font-bold">
        {{ post_info?.admin_creator?.name || post_info?.from?.name }}
      </span>
      -
      {{ formatDate(post_info?.updated_time) }}
    </div>
    <div class="flex items-center gap-3 h-16">
      <img
        v-if="post_info?.attachments?.data?.[0]?.media?.image?.src"
        :src="
          $cdn.fbPostImg(
            conversationStore.select_conversation?.fb_page_id,
            post_info?.id
          )
        "
        class="w-20 h-full flex-shrink-0 rounded"
      />
      <div class="text-sm h-full truncate-3-line">
        {{ post_info?.message }}
      </div>
    </div>
    <div
      class="flex bg-slate-100 py-1.5 px-3 rounded justify-between items-center gap-2"
    >
      <div class="text-sm font-bold truncate">
        {{ post_info?.attachments?.data?.[0].title }}
      </div>
      <button
        @click="toggleModal"
        class="bg-blue-600 text-[8px] font-bold text-white py-1 px-5 rounded flex-shrink-0"
      >
        {{ $t('v1.view.main.dashboard.chat.post.open_message') }}
      </button>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center gap-1">
        <template v-if="ad_id">
          <SpeakerIcon
            v-tooltip.bottom="$t('v1.view.main.dashboard.chat.post.from_ad')"
            class="w-3 h-3"
          />
          <span class="text-xs text-gray-500">
            {{ $t('v1.view.main.dashboard.chat.post.from_ad') }}
          </span>
        </template>
      </div>
      <a
        class="text-blue-500 text-xs underline cursor-pointer"
        @click="openPost()"
      >
        {{ $t('v1.view.main.dashboard.chat.post.open_on_facebook') }}
      </a>
    </div>
  </div>
  <!-- <FacebookCommentModal
    ref="fb_cmt_ref"
    :page_id="conversationStore.select_conversation?.fb_page_id"
    :client_id="conversationStore.select_conversation?.fb_client_id"
    :target_id="post_info?.id"
    :post_title="post_info.attachments?.data?.[0]?.title"
  /> -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format as format_date } from 'date-fns'
import { useConversationStore } from '@/stores'
import {
  get_post_from_ad_id,
  get_post_from_post_id,
} from '@/service/api/chatbox/n4-service'
import { openNewTab } from '@/service/function'
import { SingletonCdn } from '@/utils/helper/Cdn'

import Loading from '@/components/Loading.vue'
import FacebookCommentModal from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/CommentModal.vue'

import SpeakerIcon from '@/components/Icons/Speaker.vue'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const $cdn = SingletonCdn.getInst()

const $props = withDefaults(
  defineProps<{
    fb_post_id?: string
    ad_id?: string
  }>(),
  {}
)

/** ref của modal */
const fb_cmt_ref = ref<ComponentRef>()
/** trạng thái lấy bài post có thành công hay ko */
const is_get_post_success = ref(true)
/** trạng is_loading bài post */
const is_loading = ref(true)
/** Dữ liệu bài post */
const post_info = ref<{
  /**id bài viết */
  id?: string
  /**dữ liệu của admin */
  admin_creator?: {
    /**tên */
    name: string
  }
  /**dữ liệu người tạo */
  from?: {
    /**tên */
    name: string
  }
  /**file đính kèm */
  attachments?: {
    /**dữ liệu */
    data?: [
      {
        /**đa phương tiện */
        media?: {
          /**hình ảnh chính */
          image?: {
            /**đường dẫn */
            src?: string
          }
        }
        /**tiêu đề bài viết */
        title?: string
      }
    ]
  }
  /**tội dung thông điệp */
  message?: string
  /**đường dẫn của bài viết */
  permalink_url?: string
  /**thời gian cập nhật bài vieets */
  updated_time?: string
}>({})

onMounted(() => {
  // lấy dữ liệu bài viết bình thường
  if ($props.fb_post_id) getPostFromPostId()
  // lấy dữ liệu bài viết từ quảng cáo
  if ($props.ad_id) getPostFromAdId()
})

/**chuyển đổi thời gian để hiển thị */
function formatDate(date?: string) {
  // nếu không có thời gian thì thôi
  if (!date) return ''

  return format_date(new Date(date), 'dd/MM/yy')
}
/** Dùng để bật tắt modal */
function toggleModal() {
  fb_cmt_ref.value?.toggleModal()
}
/** Lấy dữ liệu bài post từ ad_id  */
function getPostFromAdId() {
  get_post_from_ad_id(
    {
      page_id: conversationStore.select_conversation?.fb_page_id,
      ad_id: $props.ad_id,
    },
    (e, r) => {
      is_loading.value = false
      if (!r || !r.id) {
        is_get_post_success.value = false
        return
      }
      post_info.value = r
    }
  )
}
/** Lấy dữ liệu bài post từ post_id */
function getPostFromPostId() {
  get_post_from_post_id(
    {
      page_id: conversationStore.select_conversation?.fb_page_id,
      post_id: $props.fb_post_id,
    },
    (e, r) => {
      is_loading.value = false
      if (!r || !r.id) return (is_get_post_success.value = false)
      post_info.value = r
    }
  )
}
/** Mở bài post trên fb */
function openPost() {
  // nếu không có dữ liệu thì thôi
  if (!post_info.value?.permalink_url) return

  openNewTab(post_info.value?.permalink_url)
}

defineExpose({ is_get_post_success })
</script>
<style scoped lang="scss">
.truncate-3-line {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
