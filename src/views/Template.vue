<template>
  <div class="flex flex-col h-full p-3 gap-3">
    <Header class="flex-shrink-0" />
    <div class="overflow-hidden h-full flex flex-col py-5">
      <div
        v-if="!code"
        class="flex flex-col items-center py-5"
      >
        <div class="p-4 bg-yellow-50 rounded-full">
          <WarningIcon class="w-7 h-7" />
        </div>
        <div class="text-2xl font-semibold">
          {{ $t('v1.view.template.error_code.title') }}
        </div>
        <div class="text-slate-700">
          {{ $t('v1.view.template.error_code.description') }}
        </div>
      </div>
      <div
        v-else-if="!is_loading"
        class="bg-white w-[672px] mx-auto rounded-lg p-2 flex flex-col min-h-0"
      >
        <div class="border-b flex-shrink-0 pt-0 p-2 flex justify-between">
          <div class="font-medium flex items-end">
            {{ $t('v1.view.template.title') }}
          </div>
          <SelectOrg class="border rounded-lg" />
        </div>
        <div
          class="flex-grow overflow-y-auto min-h-0 border-b flex flex-col gap-2.5 py-3 px-2"
        >
          <div class="text-sm font-medium">
            {{ $t('v1.view.template.code') }}
            {{ code }}
          </div>
          <div class="grid grid-cols-2 gap-y-2 gap-x-6">
            <template v-for="os of list_os">
              <PageItem
                v-if="os?.page_id"
                @click="selectPage(os?.page_id)"
                v-model:checkbox="page_ids[os?.page_id]"
                :checkbox_is_visible="true"
                :page_info="os?.page_info"
                :checkbox_is_disabled="!orgStore.isAdminOrg()"
                :class="
                  orgStore.isAdminOrg()
                    ? 'cursor-pointer'
                    : 'grayscale cursor-not-allowed'
                "
              />
            </template>
          </div>
        </div>
        <div class="flex-shrink-0 pt-2 px-4 flex justify-end">
          <button
            @click="copyPage"
            :class="
              orgStore.isAdminOrg() && isSelectedPage()
                ? 'bg-blue-700'
                : 'bg-gray-500 cursor-not-allowed'
            "
            class="py-2 px-4 rounded-md text-white"
          >
            {{ $t('v1.common.active') }}
          </button>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col items-center py-5"
      >
        <img
          src="@/assets/imgs/empty-page.png"
          class="h-52"
        />
        <div class="text-2xl font-semibold">
          {{ $t('v1.view.template.loading.title') }}
        </div>
        <div class="text-slate-700">
          {{ $t('v1.view.template.loading.description') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { initRequireData } from '@/views/composable'
import { useOrgStore } from '@/stores'
import { read_os } from '@/service/api/chatbox/billing'
import { filter, keys, map } from 'lodash'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'
import { N8MergeAppPage } from '@/utils/api/N8Merge'
import { useI18n } from 'vue-i18n'

import Header from '@/views/Dashboard/Header.vue'
import SelectOrg from '@/components/Main/Dashboard/SelectOrg.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'

import WarningIcon from '@/components/Icons/Warning.vue'

import type { OwnerShipInfo } from '@/service/interface/app/billing'

const $route = useRoute()
const orgStore = useOrgStore()
const $toast = ToastSingleton.getInst()
const { t: $t } = useI18n()

// composable
initRequireData()

/**các id trang muốn được sao chép */
const page_ids = ref<Record<string, boolean>>({})
/**code đại diện cho trang gốc */
const code = ref($route.query.code as string)
/**danh sách id trang của tổ chức đang chọn */
const list_os = ref<OwnerShipInfo[]>([])
/**trạng thái loading */
const is_loading = ref(false)

// nạp dữ liệu trang hiện tại của tổ chức khi component được mount
onMounted(getOrgPage)

// onMounted(() => {
//   /**id trang được fix sẵn */
//   const PAGE_ID = $route.query.page_id as string

//   // nếu không có id trang thì thôi
//   if (!PAGE_ID) return

//   // tự động chọn trang
//   page_ids.value[PAGE_ID] = true

//   copyPage()
// })

// lấy danh sách trang của tổ chức hiện tại khi thay đổi tổ chức
watch(() => orgStore.selected_org_id, getOrgPage)

/**lấy danh sách trang của tổ chức hiện tại */
async function getOrgPage() {
  // nếu chưa chọn tổ chức nào thì không thực hiện gì cả
  if (!orgStore.selected_org_id) return

  // lấy danh sách trang của tổ chức hiện tại
  list_os.value = await read_os(orgStore.selected_org_id)

  // reset lại danh sách trang muốn sao chép
  page_ids.value = {}
}
/**chọn trang */
function selectPage(page_id: string) {
  // nếu không phải là tổ chức quản trị thì không thực hiện gì cả
  if (!orgStore.isAdminOrg()) return

  // thay đổi trạng thái của trang
  page_ids.value[page_id] = !page_ids.value[page_id]
}
/**kiểm tra xem có trang nào được chọn không */
function isSelectedPage() {
  // lọc ra các trang được chọn
  return !!getSelectedPage()?.length
}
/**lấy danh sách trang được chọn */
function getSelectedPage() {
  /**danh sách id trang được chọn */
  const SELECTED_PAGE_IDS: string[] = []

  // lọc ra các trang được chọn
  map(page_ids.value, (is_selected, page_id) => {
    if (is_selected) SELECTED_PAGE_IDS.push(page_id)
  })

  // trả về danh sách trang được chọn
  return SELECTED_PAGE_IDS
}
/**sao chép trang */
async function copyPage() {
  try {
    // chặn nếu chưa đủ điều kiện
    if (!orgStore.isAdminOrg() || !isSelectedPage()) return

    // bật trạng thái loading
    is_loading.value = true

    // sao chép trang
    await new N8MergeAppPage().copyPageSetting(code.value, getSelectedPage())

    $toast.success($t('v1.common.success'))
  } catch (e) {
    $toast.error(e)
  } finally {
    // tắt trạng thái loading
    is_loading.value = false
  }
}
</script>
