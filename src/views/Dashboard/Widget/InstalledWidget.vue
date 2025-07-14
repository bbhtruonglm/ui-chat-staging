<template>
  <div class="flex flex-col gap-4 min-h-0 flex-grow overflow-hidden">
    <div class="flex-shrink-0 flex items-center gap-3">
      <SelectOrg class="rounded-lg" />
      <SelectPageOrg class="rounded-lg" />
    </div>
    <div class="flex-grow min-h-0 overflow-y-auto">
      <CardItem>
        <template #icon>
          <SquareIcon class="w-5 h-5" />
        </template>
        <template #title>
          {{ $t('v1.view.main.dashboard.widget.installed.title') }}
        </template>
        <template #item>
          <div class="grid gap-y-3 gap-x-6 grid-cols-4">
            <Item
              v-for="widget of app_installed_list"
              :widget="widget?.snap_app"
              class="group"
            >
              <div class="hidden group-hover:flex items-center gap-4">
                <ArrowRightLeftIcon
                  @click="confirm_re_connect_ref?.toggleModal(widget)"
                  v-tooltip="
                    $t('v1.view.main.dashboard.widget.installed.re_connect')
                  "
                  class="w-5 h-5"
                />
                <MinusIcon
                  @click="
                    confirm_delete_ref?.toggleModal(
                      widget._id,
                      widget?.snap_app?.name,
                      getSelectedPageName()
                    )
                  "
                  v-tooltip="
                    $t('v1.view.main.dashboard.widget.installed.delete')
                  "
                  class="w-5 h-5"
                />
              </div>
            </Item>
          </div>
        </template>
      </CardItem>
    </div>
  </div>
  <ConfirmDelete
    @done="deleteApp"
    ref="confirm_delete_ref"
  />
  <ConfirmReConnect
    @done="linkApp"
    ref="confirm_re_connect_ref"
  />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  get_installed_widget,
  uninstall_widget,
} from '@/service/api/chatbox/n5-app'
import { useOrgStore, usePageStore, useWidgetStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { toggle_loading } from '@/service/helper/async'
import { toast, toastError } from '@/service/helper/alert'
import { waterfall } from 'async'
import { map, remove } from 'lodash'
import { getPageName, openPopup } from '@/service/function'
import { onMounted } from 'vue'

import Item from '@/views/Dashboard/Widget/Item.vue'
import SelectOrg from '@/components/Main/Dashboard/SelectOrg.vue'
import SelectPageOrg from '@/components/Main/Dashboard/SelectPageOrg.vue'
import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import ConfirmDelete from '@/views/Dashboard/Widget/InstalledWidget/ConfirmDelete.vue'
import ConfirmReConnect from '@/views/Dashboard/Widget/InstalledWidget/ConfirmReConnect.vue'

import MinusIcon from '@/components/Icons/Minus.vue'
import SquareIcon from '@/components/Icons/Square.vue'
import ArrowRightLeftIcon from '@/components/Icons/ArrowRightLeft.vue'

import type { AppInstalledInfo } from '@/service/interface/app/widget'
import type { CbError } from '@/service/interface/function'

const $emit = defineEmits(['is_loading'])

const pageStore = usePageStore()
const widgetStore = useWidgetStore()
const orgStore = useOrgStore()
const { t: $t } = useI18n()

/**danh sách các widget đã cài đặt của trang */
const app_installed_list = ref<AppInstalledInfo[]>([])
/**ref của modal xoá app */
const confirm_delete_ref = ref<InstanceType<typeof ConfirmDelete>>()
/**ref của modal kết nối lại app */
const confirm_re_connect_ref = ref<InstanceType<typeof ConfirmReConnect>>()

// lấy dữ liệu của trang được chọn
onMounted(getInstalledWidget)

// // khi chọn nền tảng thì xoá trang đã chọn
// watch(
//   () => orgStore.selected_org_id,
//   () => (widgetStore.selected_page_id = undefined)
// )
// khi lấy dữ liệu trang của tổ chức thì tự động chọn trang đầu tiên
watch(() => pageStore.active_page_list, getSelectPageData)
// khi chọn trang thì lấy dữ liệu widget đã cài
watch(() => widgetStore.selected_page_id, getInstalledWidget)

/**tự động nạp dữ liệu của trang đầu tiên được chọn nếu có */
function getSelectPageData() {
  // nếu đã chọn trang thì thôi
  if (widgetStore.selected_page_id) return

  // nếu chưa chọn trang thì chọn trang đầu tiên
  widgetStore.selected_page_id = map(
    pageStore.active_page_list
  )?.[0]?.page?.fb_page_id
}
/**lấy tên trang được chọn */
function getSelectedPageName() {
  // nếu không có trang nào được chọn thì thôi
  if (!widgetStore.selected_page_id) return

  // trả về tên trang được chọn
  return getPageName(pageStore.active_page_list?.[widgetStore.selected_page_id]?.page)
}
/**gỡ cài đặt ứng dụng */
function deleteApp(id: string) {
  waterfall(
    [
      // * loading
      (cb: CbError) => {
        toggle_loading(true)

        cb()
      },
      // * gọi api xoá
      (cb: CbError) =>
        uninstall_widget(id, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * loại bỏ data khỏi frontend
      (cb: CbError) => {
        remove(app_installed_list.value, app => app._id === id)

        cb()
      },
    ],
    e => {
      toggle_loading(false)

      if (e) return toastError(e)

      toast(
        'success',
        $t('v1.view.main.dashboard.widget.installed.delete_success')
      )
    }
  )
}
/**lấy toàn bộ danh sách widget đã cài cho page này */
function getInstalledWidget() {
  if (!widgetStore.selected_page_id) return

  // bật cờ loading
  widgetStore.is_loading = true

  get_installed_widget(
    {
      _type: 'short-time-token',
      skip: 0,
      limit: 40,
      fb_page_id: widgetStore.selected_page_id,
    },
    (e, r) => {
      // tắt cờ loading
      widgetStore.is_loading = false

      if (r) app_installed_list.value = r
    }
  )
}
/**kết nối lại ứng dụng */
function linkApp(app: AppInstalledInfo) {
  openPopup(
    `${app?.snap_app?.url_auth}?page_id=${widgetStore.selected_page_id}&access_token=${app?.access_token}`
  )
}
</script>
