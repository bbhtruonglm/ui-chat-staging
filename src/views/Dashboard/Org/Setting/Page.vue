<template>
  <CardItem>
    <template #icon>
      <StackIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.common.page') }}
      (
      {{ orgStore.selected_org_info?.org_package?.org_current_page }}
      /
      <template v-if="orgStore.isUnlimitedPage()"> ∞ </template>
      <template v-else>
        {{ orgStore.selected_org_info?.org_package?.org_quota_page }}
      </template>
      )
    </template>
    <template #action>
      <button
        @click="openAddPageModal"
        class="py-1 px-4 rounded-md text-sm font-medium bg-blue-600 text-white"
      >
        {{ $t('v1.common.more') }}
      </button>
    </template>
    <template #item>
      <div class="grid gap-6 grid-cols-1 md:grid-cols-4">
        <template v-for="os of orgStore.list_os">
          <PageItem
            v-if="os?.page_info"
            :page_info="os?.page_info"
            :checkbox_is_visible="false"
            class="cursor-pointer"
          >
            <template #after-name>
              <div
                @click.stop="prepareInactivePage(os?.page_info)"
                v-tooltip="$t('v1.view.main.dashboard.select_page.cancel_page')"
                class="group/minus hidden group-hover:flex"
              >
                <MinusOutlineIcon
                  class="w-4 h-4 text-slate-500 group-hover/minus:hidden"
                />
                <MinusIcon
                  class="w-4 h-4 text-slate-900 hidden group-hover/minus:block"
                />
              </div>
            </template>
          </PageItem>
        </template>
      </div>
    </template>
  </CardItem>
  <ConfirmInactive
    @done="doneInactivePage"
    :selected_page
    ref="confirm_inactive_modal_ref"
  />
  <ConnectPage
    @done="getOs()"
    ref="connect_page_ref"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useOrgStore } from '@/stores'
import { read_os } from '@/service/api/chatbox/billing'
import { toastError } from '@/service/helper/alert'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'

import ConfirmInactive from '@/views/Dashboard/Org/Setting/Page/ConfirmInactive.vue'
import ConnectPage from '@/views/Dashboard/ConnectPage.vue'

import StackIcon from '@/components/Icons/Stack.vue'
import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'
import MinusIcon from '@/components/Icons/Minus.vue'

import type { IPage, PageInfo } from '@/service/interface/app/page'
import type { OwnerShipInfo } from '@/service/interface/app/billing'
import { remove } from 'lodash'

const orgStore = useOrgStore()

/**modal xác nhận huỷ trang */
const confirm_inactive_modal_ref = ref<InstanceType<typeof ConfirmInactive>>()
/**page đang được chọn */
const selected_page = ref<IPage>()
/**danh sách trang trong tổ chức */
// const list_os = ref<OwnerShipInfo[]>()
/**ref của modal kết nối nền tảng */
const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()

// nạp dữ liệu trang khi component được mount
onMounted(getOs)
// nạp dữ liệu trang khi tổ chức được chọn
watch(() => orgStore.selected_org_id, getOs)

/**chuẩn bị huỷ kích hoạt trang */
function prepareInactivePage(page?: IPage) {
  // chọn trang
  selected_page.value = page

  // hiển thị alert cảnh báo
  confirm_inactive_modal_ref.value?.toggleModal()
}
/**hoàn thành việc huỷ kích hoạt trang */
async function doneInactivePage() {
  // xoá trang khỏi danh sách trang đang chọn
  remove(
    orgStore.list_os || [],
    os => os?.page_info?.fb_page_id === selected_page.value?.fb_page_id
  )

  // xoá trang đang chọn
  selected_page.value = undefined
}
/**lấy danh sách trang của tổ chức này */
async function getOs() {
  // nếu chưa chọn tổ chức thì thôi
  if (!orgStore.selected_org_id) return

  // bật loading
  orgStore.is_loading = true

  try {
    // lấy danh sách trang của tổ chức
    orgStore.list_os = await read_os(orgStore.selected_org_id)
    // list_os.value = await read_os(orgStore.selected_org_id)

    // ghi đè lại tổng số trang hiện tại
    if (orgStore.selected_org_info?.org_package)
      orgStore.selected_org_info.org_package.org_current_page =
        orgStore.list_os.length
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // tắt loading
  orgStore.is_loading = false
}
/**mở modal thêm trang */
function openAddPageModal() {
  // mở modal thêm trang
  connect_page_ref.value?.toggleModal('PAGE')
}
</script>
