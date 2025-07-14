<template>
  <CardItem
    v-if="$main.countPage()"
    id="all-org__org-item"
    :class="{
      'opacity-50':
        orgStore.selected_org_id !== org_id &&
        size(pageStore.selected_page_id_list) &&
        selectPageStore.is_group_page_mode,
    }"
    class="group/org-item"
    class_title="flex items-center gap-2 flex-grow min-w-0 w-full overflow-hidden"
  >
    <template #icon>
      <img
        v-if="pageStore.map_orgs?.map_org_info?.[org_id]?.org_info?.org_avatar"
        :src="pageStore.map_orgs?.map_org_info?.[org_id]?.org_info?.org_avatar"
        class="w-5 h-5 rounded-oval"
      />
      <BriefCaseIcon
        v-else
        class="w-5 h-5 text-slate-700"
      />
    </template>
    <template #title>
      <div class="flex-shrink-0">
        {{ pageStore.map_orgs?.map_org_info?.[org_id]?.org_info?.org_name }}
      </div>
      <Group :org_id />
    </template>
    <template #action>
      <OrgTitleAction
        v-if="size(active_page_list)"
        v-model:selected_platform="selected_platform"
        :org_id
        :active_page_list
      />
    </template>
    <template #item>
      <OrgPages
        @sort_list_page="$main.getListPage"
        v-model:active_page_list="active_page_list"
        :org_id
      />
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { usePageManager } from '@/views/Dashboard/composables/usePageManager'
import { filter, size } from 'lodash'
import { onMounted, ref, watch } from 'vue'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Group from '@/views/Dashboard/SelectPage/AllOrg/Org/Group.vue'
import OrgPages from '@/views/Dashboard/SelectPage/AllOrg/Org/OrgPages.vue'
import OrgTitleAction from '@/views/Dashboard/SelectPage/AllOrg/Org/OrgTitleAction.vue'

import BriefCaseIcon from '@/components/Icons/BriefCase.vue'

import type { PageData } from '@/service/interface/app/page'
import type { ISelectPlatform } from '@/views/Dashboard/SelectPage/type'

const $props = withDefaults(
  defineProps<{
    /** id tổ chức */
    org_id: string
  }>(),
  {}
)

const orgStore = useOrgStore()
const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()

/** composable */
const { sortListPage } = usePageManager()

/**lọc theo nền tảng */
const selected_platform = ref<ISelectPlatform>('ALL_PLATFORM')
/**danh sách page sau khi được lọc */
const active_page_list = defineModel<PageData[]>('active_page_list')

class Main {
  /**sắp xếp page gắn sao lên đầu */
  getListPage() {
    // lọc ra các page thuộc về nhóm này
    active_page_list.value = sortListPage()?.filter(this.isVisible.bind(this))
  }

  /** đếm số page của tổ chức hiện tại với nền tảng đang được lọc */
  countPage(): number {
    /** các page của tổ chức hiện tại */
    const PAGE_OF_THIS_ORG = filter(pageStore.all_page_list, page => 
      this.isVisible(page)
    )

    return PAGE_OF_THIS_ORG?.length
  }

  /**có hiển thị trang không */
  isVisible(page?: PageData): boolean {    
    // không có page thì không hiển thị
    if (!page?.page?.fb_page_id) return false

    // chỉ hiển thị trang của tổ chức này
    if (
      !pageStore.map_orgs?.map_org_page?.[$props.org_id]?.[
        page?.page?.fb_page_id
      ]
    )
      return false

    /**giá trị nền tảng đang được chọn */
    let current_selected_platform: ISelectPlatform = selected_platform.value

    // nếu menu chọn tổng không phải là tất cả thì ghi đè theo menu ngoài
    if (selectPageStore.current_menu !== 'ALL_PLATFORM')
      current_selected_platform = selectPageStore.current_menu

    // zalo là ngoại lệ vì gộp 2 tab vào 1
    if (
      current_selected_platform === 'ZALO' &&
      page?.page?.type?.includes('ZALO')
    )
      return true

    // nếu chọn nền tảng cụ thể mà trang không thuộc nền tảng đó thì không hiển thị
    if (
      current_selected_platform !== 'ALL_PLATFORM' &&
      // phải chọn đúng nền tảng
      page?.page?.type !== current_selected_platform
    )
      return false

    // cho phép hiển thị
    return true
  }
}
const $main = new Main()

// load danh sách trang khi component được tạo
onMounted(() => $main.getListPage())

// lọc danh sách page khi được tìm kiếm
watch(
  () => selectPageStore.search,
  () => $main.getListPage()
)
// nạp lại danh sách page thì có thay đổi
watch(
  () => pageStore.active_page_list,
  () => $main.getListPage()
)
// thay đổi nền tảng ở trong
watch(
  () => selected_platform.value,
  () => $main.getListPage()
)
// thay đổi nền tảng ở ngoài
watch(
  () => selectPageStore.current_menu,
  () => $main.getListPage()
)
// khi có dữ liệu tổ chức-page
watch(
  () => pageStore.map_orgs,
  () => $main.getListPage()
)
</script>
