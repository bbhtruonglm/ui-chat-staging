<template>
  <div class="border-b font-semibold pb-1 flex items-center justify-between">
    <MenuTitle
      v-if="filter_post"
      :title="$t('v1.view.main.dashboard.chat.filter.post.filter_by_post')"
    />
    <MenuTitle
      v-else
      :title="$t('v1.view.main.dashboard.chat.filter.post.filter_by_comment')"
    />
    <div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          v-model="filter_post"
          class="sr-only peer"
        />
        <div
          class="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-focus:ring-0 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"
        ></div>
      </label>
    </div>
  </div>
  <div class="py-3">
    <input
      ref="search_ref"
      type="text"
      :placeholder="$t('Tìm kiếm id bài đăng')"
      class="border px-3 py-1 w-full rounded-lg focus:outline-none text-sm"
      v-on:keyup="searchPost"
      v-model="search_post_id"
    />
  </div>
  <div
    class="overflow-hidden overflow-y-scroll"
    :class="{ 'h-[250px]': !filter_post, 'h-[420px]': filter_post }"
  >
    <div
      class="w-full flex items-center justify-between py-2.5 border-b cursor-pointer hover:bg-orange-100 px-2"
      v-for="(post, index) in posts"
      @click="selectPost(index)"
    >
      <div class="flex justify-between items-center w-full">
        <div class="mr-3">
          <object
            :data="$cdn.fbPostImg(post?.page_id, post?.post_id)"
            type="image/png"
            class="min-w-[64px] w-[64px] h-[64px] rounded-lg object-cover"
          >
            <img
              src="@/assets/imgs/chatbox.svg"
              class="w-[64px] h-[64px]"
            />
          </object>
        </div>
        <div class="w-full">
          <div class="flex justify-between w-full mb-2">
            <div class="text-orange-600 text-xs">{{ post?.post_id }}</div>
            <div class="text-xs text-gray-500">
              {{
                format(
                  new Date(post?.content?.created_time || 0),
                  'HH:mm dd/MM/yyyy'
                )
              }}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="w-[250px] text-gray-700 post-truncate">
              {{ post.message }}
            </div>
            <img
              v-if="post.is_selected"
              class="w-5 h-5 mt-[-14px]"
              src="@/assets/icons/check-circle.svg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="w-full mt-5 mb-5"
    v-if="!filter_post"
    id="filter_popover_ref"
  >
    <div class="grid grid-cols-3 mb-3 gap-3">
      <div class="text-sm text-black">
        {{ $t('v1.view.main.dashboard.chat.filter.post.page_reply') }}
      </div>
      <div>
        <label class="text-sm cursor-pointer flex items-center">
          <input
            type="radio"
            value="YES"
            v-model="filter_keys.is_reply"
            class="ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5"
          />
          <span>{{
            $t('v1.view.main.dashboard.chat.filter.post.replied')
          }}</span>
        </label>
      </div>
      <div>
        <label class="text-sm cursor-pointer flex items-center">
          <input
            type="radio"
            value="NO"
            v-model="filter_keys.is_reply"
            class="ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5"
          />
          <span>{{
            $t('v1.view.main.dashboard.chat.filter.post.unreplied')
          }}</span>
        </label>
      </div>
    </div>
    <div class="grid grid-cols-3 mb-3 gap-3">
      <div class="text-sm text-black">
        {{ $t('v1.view.main.dashboard.chat.filter.post.page_inbox') }}
      </div>
      <div>
        <label class="text-sm cursor-pointer flex items-center">
          <input
            type="radio"
            value="YES"
            v-model="filter_keys.is_private_reply"
            class="ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5"
          />
          <span>{{
            $t('v1.view.main.dashboard.chat.filter.post.replied')
          }}</span>
        </label>
      </div>
      <div>
        <label class="text-sm cursor-pointer flex items-center">
          <input
            type="radio"
            value="NO"
            v-model="filter_keys.is_private_reply"
            class="ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5"
          />
          <span>{{
            $t('v1.view.main.dashboard.chat.filter.post.unreplied')
          }}</span>
        </label>
      </div>
    </div>
    <div class="grid grid-cols-3 mb-3 gap-3">
      <div class="text-sm text-black">
        {{ $t('v1.view.main.dashboard.chat.filter.post.have_phone') }}
      </div>
      <div>
        <label class="text-sm cursor-pointer flex items-center">
          <input
            type="radio"
            value="YES"
            v-model="filter_keys.have_phone"
            class="ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5"
          />
          <span>{{ $t('v1.view.main.dashboard.chat.filter.post.yes') }}</span>
        </label>
      </div>
      <div>
        <label class="text-sm cursor-pointer flex items-center">
          <input
            type="radio"
            value="NO"
            v-model="filter_keys.have_phone"
            class="ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5"
          />
          <span>{{ $t('v1.view.main.dashboard.chat.filter.post.no') }}</span>
        </label>
      </div>
    </div>
    <div class="grid grid-cols-3 mb-3 gap-3">
      <div class="text-sm text-black">
        {{ $t('v1.view.main.dashboard.chat.filter.post.have_email') }}
      </div>
      <div>
        <label class="text-sm cursor-pointer flex items-center">
          <input
            type="radio"
            value="YES"
            v-model="filter_keys.have_email"
            class="ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5"
          />
          <span>{{ $t('v1.view.main.dashboard.chat.filter.post.yes') }}</span>
        </label>
      </div>
      <div>
        <label class="text-sm cursor-pointer flex items-center">
          <input
            type="radio"
            value="NO"
            v-model="filter_keys.have_email"
            class="ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5"
          />
          <span>{{ $t('v1.view.main.dashboard.chat.filter.post.no') }}</span>
        </label>
      </div>
    </div>
    <div
      class="flex items-center justify-between cursor-pointer"
      @click.stop="date_picket_ref?.toggle"
    >
      <div class="text-sm text-black">Chọn thời gian</div>
      <div class="cursor-pointer">
        <img
          :src="ArrowRightIcon"
          alt=""
          class="mr-3"
        />
      </div>
    </div>
  </div>
  <div class="w-full flex justify-end absolute bottom-3 right-3">
    <button
      @click="cancelFilter"
      class="text-white bg-gray-500 px-3 py-1 rounded-lg mr-3"
    >
      {{ $t('v1.view.main.dashboard.chat.filter.post.cancel_filter') }}
    </button>
    <button
      @click="filterPost"
      class="text-white px-5 py-1 rounded-lg"
      :class="{
        'bg-orange-500': mergePostSelect().length,
        'bg-orange-300': mergePostSelect().length === 0,
      }"
    >
      {{ $t('v1.view.main.dashboard.chat.filter.post.filter') }}
    </button>
  </div>
  <FilterDateOfPost
    ref="date_picket_ref"
    :time_picked="updateFilterTime"
    :time_range="{ start_time: Date.now(), end_time: Date.now() }"
  />
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { Cdn } from '@/utils/helper/Cdn'
import { format } from 'date-fns'
import { debounce } from 'lodash'
import { container } from 'tsyringe'
import { ref } from 'vue'

import FilterDateOfPost from '@/components/Main/Dashboard/FilterDateOfPost.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'

import ArrowRightIcon from '@/assets/icons/arrow-right.svg'

import type { IPost } from '@/service/interface/app/message'
import type { ComponentRef } from '@/service/interface/vue'
import { nextTick } from 'async'

/** Interface của bài post */
interface IFilterPost extends IPost {
  /** Trạng thái đã được chọn hay chưa */
  is_selected?: boolean
}

/** props */
const $props = defineProps({
  getPostList: {
    type: Function,
    required: true,
  },
})

const conversationStore = useConversationStore()
const $cdn = container.resolve(Cdn)

/** ref của date picker */
const date_picket_ref = ref<ComponentRef>()
/** Danh sách bài post */
const posts = defineModel<IFilterPost[]>('posts', {
  required: true,
})
/** Trạng thái lọc theo comment */
const filter_post = ref<boolean>(false)
/** Biến tạm lưu id bài đăng cần tìm kiếm */
const search_post_id = defineModel<string>('search_post_id', {
  required: true,
})
/** Biến tạm lưu giá trị bộ lọc */
const filter_keys = defineModel<{ [index: string]: string }>('filter_keys', {
  required: true,
})
/** Thời gian lọc */
const filter_times = ref<{
  start_time: number
  end_time: number
}>({
  start_time: 0,
  end_time: 0,
})
// * Trạng thái có lọc theo bài post hay không
const filter_timerange = ref<boolean>(false)

/** Tìm kiếm bài post */
const searchPost = debounce(() => $props.getPostList(), 100)
/** Lựa chọn bài post */
function selectPost(index: number) {
  posts.value[index].is_selected = !posts.value[index].is_selected
}
/** Cập nhật lại thời gian filter */
function updateFilterTime(start_time: number, end_time: number) {
  filter_times.value = { start_time, end_time }
  // * Gắn cờ là có filter theo thời gian
  filter_timerange.value = true
}
/** Hủy lọc */
function cancelFilter() {
  filter_keys.value = {
    is_reply: '',
    have_email: '',
    have_phone: '',
    is_private_reply: '',
    post_id: '',
  }


  // dừng nextTick để đợi filter_keys.value thay đổi mới gán
  nextTick(() => {
    conversationStore.option_filter_page_data = {
      ...conversationStore.option_filter_page_data,
      ...filter_keys.value,
      ...{ post_id: '', time_range: undefined },
    }
  })
  posts.value = posts.value.map(item => {
    item.is_selected = false
    return item
  })
}
/** Lọc bài post */
function filterPost() {
  if (mergePostSelect().length == 0) return

  // Chỉ lọc theo bài post
  if (filter_post.value) {
    const keys: { [index: string]: string } = {
      is_reply: '',
      have_email: '',
      have_phone: '',
      is_private_reply: '',
    }
    conversationStore.option_filter_page_data = {
      ...conversationStore.option_filter_page_data,
      ...keys,
      ...{
        post_id: mergePostSelect(),
        time_range: {},
      },
    }

    return
  }

  // * Lọc theo toàn bộ lựa chọn đang có
  conversationStore.option_filter_page_data = {
    ...conversationStore.option_filter_page_data,
    ...filter_keys.value,
    ...{
      post_id: mergePostSelect(),
      time_range: filter_timerange.value
        ? {
            gte: filter_times.value.start_time,
            lte: filter_times.value.end_time,
          }
        : {},
    },
  }
}
/** Gom bài post đã chọn thành 1 string để filter */
function mergePostSelect(): string {
  let post_selected: string[] = []
  posts.value.map(item => {
    if (item.is_selected) post_selected.push(item.post_id || '')
  })
  return post_selected.join(' ')
}
</script>

<style scoped lang="scss">
.post-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 12px;
}

.custom-radio:checked {
  accent-color: orangered;
}
</style>
