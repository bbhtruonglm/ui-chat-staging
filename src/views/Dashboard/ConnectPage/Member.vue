<template>
  <LowPermision v-if="!orgStore.isAdminOrg()" />
  <template v-else>
    <div class="h-full p-2 overflow-y-auto flex flex-col gap-2.5">
      <div class="text-sm font-medium">
        {{ $t('v1.view.main.dashboard.org_staff.admin') }}
      </div>
      <div class="grid grid-cols-3 gap-x-6 gap-y-2.5">
        <template v-for="staff of list_ms">
          <Item
            @done="readMs"
            v-if="$member_ship_helper.isAdmin(staff) && filterStaff(staff)"
            :staff
          />
        </template>
      </div>
      <div class="text-sm font-medium">
        {{ $t('v1.view.main.dashboard.org_staff.member') }}
      </div>
      <div class="grid grid-cols-3 gap-x-6 gap-y-2.5">
        <template v-for="staff of list_ms">
          <Item
            @done="readMs"
            v-if="$member_ship_helper.isStaff(staff) && filterStaff(staff)"
            :staff
          />
        </template>
      </div>
    </div>
    <div class="flex-shrink-0 flex p-2 border-t justify-end">
      <Button
        @click="add_ref?.toggleModal()"
        class="bg-blue-700 text-white"
      >
        {{ $t('v1.view.main.dashboard.org_staff.add.title') }}
      </Button>
    </div>
  </template>
  <Add
    @done="readMs"
    ref="add_ref"
  />
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useConnectPageStore, useOrgStore } from '@/stores'
import { nonAccentVn } from '@/service/helper/format'
import { read_ms } from '@/service/api/chatbox/billing'
import { useI18n } from 'vue-i18n'
import { SingletonMemberShipHelper } from '@/utils/helper/Billing/MemberShip'

import LowPermision from '@/views/Dashboard/ConnectPage/ActivePage/LowPermision.vue'
import Add from '@/views/Dashboard/ConnectPage/Member/Add.vue'
import Item from '@/views/Dashboard/ConnectPage/Member/Item.vue'
import Button from '@/views/Dashboard/ConnectPage/Button.vue'

import type { MemberShipInfo } from '@/service/interface/app/billing'

const $emit = defineEmits(['done', 'close'])

const connectPageStore = useConnectPageStore()
const $member_ship_helper = SingletonMemberShipHelper.getInst()
const orgStore = useOrgStore()
const { t: $t } = useI18n()

/**thêm thành viên */
const add_ref = ref<InstanceType<typeof Add>>()

/**danh sách thành viên */
const list_ms = ref<MemberShipInfo[]>()

// nạp danh sách nhân viên khi component được mount
onMounted(readMs)
// nạp danh sách nhân viên khi chọn tổ chức khác
watch(() => orgStore.selected_org_id, readMs)

/**đọc danh sách thành viên của tổ chức */
async function readMs() {
  try {
    // nếu chưa chọn org thì thôi
    if (!orgStore.selected_org_id) return

    // bật loading
    orgStore.is_loading = true
    // lấy danh sách thành viên
    list_ms.value = await read_ms(orgStore.selected_org_id)
  } catch (e) {
    // xoá mảng
    list_ms.value = []
  } finally {
    // tắt loading
    orgStore.is_loading = false
  }
}
/**hiển thị các staff theo tìm kiếm */
function filterStaff(staff: MemberShipInfo) {
  // nếu không có giá trị tìm kiếm thì luôn hiển thị
  if (!connectPageStore.search) return true

  /**giá trị tìm kiếm đã được xử lý */
  const SEARCH = nonAccentVn(connectPageStore.search)

  // tìm theo id hoặc tên trang
  return (
    staff?.staff_id?.includes(SEARCH) ||
    nonAccentVn(staff?.user_info?.full_name || '')?.includes(SEARCH)
  )
}
</script>
