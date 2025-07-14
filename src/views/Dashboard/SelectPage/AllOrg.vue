<template>
  <div
    id="select-page__all-org"
    class="overflow-y-auto flex flex-col gap-6 pb-16"
  >
    <SkeletonGroupPage v-if="selectPageStore.is_loading" />
    <template v-else>
      <template v-for="org of sortBy(orgStore.list_org, 'org_info.org_name')">
        <Org
          v-if="org?.org_id"
          :key="org?.org_id"
          :org_id="org?.org_id"
          v-model:active_page_list="active_pages_of_orgs[org?.org_id]"
        />
      </template>
      <EmptyPage
        v-if="$main.isVisibleEmptyPage() && !selectPageStore.is_loading"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { flatten, omitBy, sortBy, values } from 'lodash'
import { provide, ref } from 'vue'
import { KEY_ADVANCE_SELECT_AGE_FUNCT } from './symbol'

import Org from '@/views/Dashboard/SelectPage/AllOrg/Org.vue'
import EmptyPage from '@/views/Dashboard/SelectPage/EmptyPage.vue'
import SkeletonGroupPage from '@/views/Dashboard/SkeletonGroupPage.vue'

import type { PageData } from '@/service/interface/app/page'

const selectPageStore = useSelectPageStore()
const pageStore = usePageStore()
const orgStore = useOrgStore()

// /**
//  * hàm lấy dữ liệu tổ chức và trang 
//  * @deprecated sử dụng getALlOrgAndPage trong composable usePageManager
// */
// const getALlOrgAndPage = inject(KEY_GET_ALL_ORG_AND_PAGE_FN)

/**danh sách page của từng tổ chức */
const active_pages_of_orgs = ref<Record<string, PageData[]>>({})

class Main {
  /**có hiện ui không có page không */
  isVisibleEmptyPage() {
    return !flatten(values(active_pages_of_orgs.value))?.length
  }
  /**lọc ra các trang thuộc 1 tổ chức nào đó */
  filterOrgPageOnly(page: PageData): boolean {
    /**id trang */
    const PAGE_ID = page?.page?.fb_page_id

    // nếu không có id trang thì ẩn
    if (!PAGE_ID) return false

    /**id tổ chức của trang này */
    const ORG_ID = pageStore.map_orgs?.map_page_org?.[PAGE_ID]

    // nếu không có tổ chức thì ẩn
    if (!ORG_ID) return false

    // hiện
    return true
  }
  /**xử lý khi trang được chọn ở chế độ nhiều */
  triggerSelectPage(page: PageData): void {
    // nếu không có page thì không chọn
    if (!page?.page?.fb_page_id) return

    // chọn lại tổ chức đang chọn
    orgStore.selected_org_id =
      pageStore.map_orgs?.map_page_org?.[page?.page?.fb_page_id!]

    // loại bỏ tất cả trang đang chọn khác tổ chức này
    pageStore.selected_page_id_list = omitBy(
      pageStore.selected_page_id_list,
      (v, page_id) => {
        /**id tổ chức của trang này */
        const ORG_ID = pageStore.map_orgs?.map_page_org?.[page_id]

        // nếu tổ chức không phải tổ chức đang chọn thì loại bỏ
        return ORG_ID !== orgStore.selected_org_id
      }
    )
  }
}
const $main = new Main()

// cung cấp hàm xử lý khi chọn trang
provide(KEY_ADVANCE_SELECT_AGE_FUNCT, $main.triggerSelectPage)
</script>
