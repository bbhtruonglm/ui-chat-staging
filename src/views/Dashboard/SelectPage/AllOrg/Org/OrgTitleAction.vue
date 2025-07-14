<template>
  <div class="flex-shrink-0">
    <template v-if="selectPageStore.is_group_page_mode">
      <div
        v-if="orgStore.selected_org_id === org_id && $main.countSelectedPage()"
        class="flex items-center gap-3 flex-shrink-0"
      >
        <div class="flex items-center gap-1 py-1 px-2 rounded-md bg-blue-700">
          <div class="font-medium text-xs text-white">
            {{ $t('v1.common.selected') }}
          </div>
          <div class="font-medium text-xs px-1 rounded bg-white">
            {{ $main.countSelectedPage() }}
          </div>
        </div>
        <div
          @click="$main.cancelSelectPage"
          class="flex items-center gap-1 rounded-md cursor-pointer text-slate-500"
        >
          <div class="font-medium text-xs">
            {{ $t('v1.common.deselect') }}
          </div>
          <CloseBoldIcon class="w-4 h-4" />
        </div>
      </div>
      <button
        v-else
        @click="$main.selectAllOrgPage"
        class="text-blue-700 flex items-center gap-1"
      >
        <CheckCircelIcon class="w-4 h-4" />
        <div class="font-medium text-xs">
          {{ $t('v1.common.select_all') }}
        </div>
      </button>
    </template>
    <template v-else>
      <button
        @click="$main.quickGroupAllPage"
        class="text-sm font-medium items-center gap-1 hover:text-blue-700 flex invisible group-hover/org-item:visible"
      >
        {{ $t('v1.view.main.dashboard.select_page.munti_chat_page') }}
        <ArrowUpCircleIcon class="w-5 h-5 rotate-90" />
      </button>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { usePageManager } from '@/views/Dashboard/composables/usePageManager'
import { KEY_ADVANCE_SELECT_AGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { set, values } from 'lodash'
import { inject } from 'vue'

import ArrowUpCircleIcon from '@/components/Icons/ArrowUpCircle.vue'
import CheckCircelIcon from '@/components/Icons/CheckCircel.vue'
import CloseBoldIcon from '@/components/Icons/CloseBold.vue'

import type { PageData } from '@/service/interface/app/page'

const $props = withDefaults(
  defineProps<{
    /**id tổ chức */
    org_id: string
    /**dữ liệu trang */
    active_page_list?: PageData[]
  }>(),
  {}
)

const pageStore = usePageStore()
const orgStore = useOrgStore()
const selectPageStore = useSelectPageStore()

/** composable */
const { goToChat } = usePageManager()

class Main {
  /**vào chế độ gộp trang + chọn toàn bộ các trang */
  quickGroupAllPage() {
    // chọn toàn bộ trang của tổ chức này
    this.selectAllOrgPage()

    // vào chat luôn
    goToChat()
  }
  /**xử lý khi trang được chọn ở chế độ nhiều */
  triggerSelectPage = inject(KEY_ADVANCE_SELECT_AGE_FUNCT)

  /**chọn toàn bộ trang của tổ chức này */
  selectAllOrgPage() {
    // clear danh sách các page đang được chọn
    pageStore.selected_page_id_list = {}

    // lặp qua từng trang khả thi của tổ chức này
    $props.active_page_list?.map(page => {
      /**id trang */
      const PAGE_ID = page?.page?.fb_page_id

      // nếu không có id trang thì bỏ qua
      if (!PAGE_ID) return

      // chọn trang này
      set(pageStore.selected_page_id_list, PAGE_ID, true)
    })

    /**trang đầu tiên của tổ chức */
    const FIRST_PAGE = $props.active_page_list?.[0]

    // gọi hàm xử lý khi trang được chọn ở chế độ nhiều
    if (FIRST_PAGE) this.triggerSelectPage?.(FIRST_PAGE)
  }
  /**hủy chọn toàn bộ các trang */
  cancelSelectPage() {
    pageStore.selected_page_id_list = {}
  }
  /**đếm số trang đã chọn */
  countSelectedPage() {
    return values(pageStore.selected_page_id_list)?.filter(Boolean)?.length
  }
}
const $main = new Main()
</script>
