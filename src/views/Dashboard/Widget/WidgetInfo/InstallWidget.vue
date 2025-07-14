<template>
  <Alert
    @open_modal="checkPageIsInstalledWidget"
    @close_modal="clear"
    ref="install_widget_ref"
    class_modal="w-[620px]"
    class_body="py-3 flex flex-col gap-2.5"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.widget.install.title') }}
    </template>
    <template v-slot:body>
      <div class="text-xs font-medium">
        {{ $t('v1.view.main.dashboard.widget.install.select_page') }}
      </div>
      <div class="grid grid-cols-2 gap-3">
        <SelectOrg class="border rounded-lg" />
        <SelectPageOrg class="border rounded-lg" />
      </div>
      <div
        v-if="is_page_installed_widget"
        class="text-sm text-red-500"
      >
        {{
          $t('v1.view.main.dashboard.widget.install.already_installed', {
            name: getSelectedPageName(),
          })
        }}
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="installWidget"
        :class="setCssBtnDone()"
        class="btn-custom"
      >
        {{ $t('v1.view.main.dashboard.widget.install.done') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
import { map, set } from 'lodash'
import { get_page_group_staff } from '@/service/api/chatbox/n4-service'
import {
  check_page_install_widget,
  install_widget,
} from '@/service/api/chatbox/n5-app'
import { getPageName, openPopup } from '@/service/function'
import { flow } from '@/service/helper/async'
import { useOrgStore, usePageStore, useWidgetStore } from '@/stores'
import { useRouter } from 'vue-router'

import SelectOrg from '@/components/Main/Dashboard/SelectOrg.vue'
import SelectPageOrg from '@/components/Main/Dashboard/SelectPageOrg.vue'
import Alert from '@/components/Alert.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { GroupStaffInfo } from '@/service/interface/app/page'
import type { CbError } from '@/service/interface/function'

const $t = useI18n().t
const widgetStore = useWidgetStore()
const pageStore = usePageStore()
const $router = useRouter()
const orgStore = useOrgStore()

/**ref của modal */
const install_widget_ref = ref<ComponentRef>()
/**trang đã cài widget chưa */
const is_page_installed_widget = ref(false)
/**đã cài xong */
const is_done = ref(false)

// khi chọn nền tảng thì xoá cờ
watch(() => orgStore.selected_org_id, clear)
// kiểm tra trang đã cài widget chưa khi được chọn
watch(() => widgetStore.selected_page_id, checkPageIsInstalledWidget)

/**dọn dữ liệu khi đóng modal */
function clear() {
  // xoá cờ trạng thái cài đặt
  is_page_installed_widget.value = false
  // xoá cờ đã cài xong
  is_done.value = false
}
/**lấy tên trang được chọn */
function getSelectedPageName() {
  // nếu không có trang nào được chọn thì thôi
  if (!widgetStore.selected_page_id) return

  // trả về tên trang được chọn
  return getPageName(pageStore.active_page_list?.[widgetStore.selected_page_id]?.page)
}
/**cài đặt css cho button done */
function setCssBtnDone() {
  // chưa chọn trang, trang đã cài đặt
  if (!widgetStore.selected_page_id || is_page_installed_widget.value)
    return 'bg-slate-500 text-slate-100 cursor-not-allowed'
  // dã cài đặt xong
  else if (is_done.value) return 'bg-green-100 text-green-600'
  // có thể cài đặt
  else return 'bg-blue-700 text-white'
}
/**kiểm tra trang đã cài widget chưa */
async function checkPageIsInstalledWidget() {
  try {
    // nếu chưa chọn widget thì bỏ qua
    if (!widgetStore.selected_widget?._id || !widgetStore.selected_page_id)
      return

    // gọi api kiểm tra
    check_page_install_widget(
      {
        _type: 'check-page-is-installed-app',
        app_id: widgetStore.selected_widget?._id,
        list_page: { [widgetStore.selected_page_id]: {} },
      },
      (e, r) => {
        // gắn cờ trạng thái cài đặt
        is_page_installed_widget.value =
          r?.[widgetStore.selected_page_id!]?.is_installed || false
      }
    )
  } catch (e) {}
}
/**cài đặt widget */
function installWidget() {
  // nếu đã cài xong thì tắt modal
  if (is_done.value) $router.push('/dashboard/widget/installed')

  // nếu chưa chọn widget hoặc trang hoặc đã cài đặt thì bỏ qua
  if (
    !widgetStore.selected_widget?._id ||
    !widgetStore.selected_page_id ||
    is_page_installed_widget.value ||
    is_done.value
  )
    return

  /**các quyền có thể cài đặt */
  let access_role_select = {}
  /**danh sách cac nhóm nhân viên của trang đang chọn */
  let group_staff_list: GroupStaffInfo[] = []
  /**token truyền cho popup để kích hoạt */
  let access_token: string | undefined

  // cài đặt mặc định các quyền mà widget yêu cầu
  map(widgetStore.selected_widget?.access_role, (is_active, role) => {
    // bỏ qua id record mongo
    if (role === '_id') return

    // mapping kích hoạt mặc định
    set(access_role_select, [role], is_active)
  })

  flow(
    [
      // * gọi api lấy danh sách nhóm nhân viên
      (cb: CbError) =>
        get_page_group_staff(
          {
            fb_page_id: widgetStore.selected_page_id!,
            skip: 0,
            limit: 40,
          },
          (e, r) => {
            group_staff_list =
              r?.map(group_staff => {
                group_staff.is_select = true

                return group_staff
              }) || []

            cb()
          }
        ),
      // * gọi api cài đặt
      (cb: CbError) =>
        install_widget(
          {
            app_id: widgetStore.selected_widget?._id!,
            fb_page_id: widgetStore.selected_page_id!,
            position: 'RIGHT',
            app_installed_size: 'MEDIUM',
            access_role_select: access_role_select,
            access_group: group_staff_list
              ?.filter(n => n.is_select)
              ?.map(n => n._id),
            hide_pc: false,
          },
          (e, r) => {
            if (e) return cb(e)

            access_token = r?.access_token
            cb()
          }
        ),
      // * done
      (cb: CbError) => {
        // gắn cờ đã cài xong
        is_done.value = true

        // mở popup
        openPopup(
          `${widgetStore.selected_widget?.url_auth}?page_id=${widgetStore.selected_page_id}&access_token=${access_token}`
        )

        cb()
      },
    ],
    undefined,
    true
  )
}
/**mở modal */
function toggleModal() {
  install_widget_ref.value.toggleModal()
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
