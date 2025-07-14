<template>
  <Modal
    @open_modal="getAnotherOrgStaff"
    ref="modal_member_ship_ref"
    class_modal="h-3/4"
    class_body="py-2 flex gap-2"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.org.setting.staff.title') }}
    </template>
    <template #body>
      <div class="w-[784px] bg-white rounded-md p-2 flex flex-col relative">
        <div
          v-if="is_loading"
          class="absolute top-14 left-1/2 -translate-x-1/2"
        >
          <Loading class="mx-auto" />
        </div>
        <div
          class="font-semibold p-2 border-b border-slate-200 flex-shrink-0 flex items-center justify-between"
        >
          <div class="flex-shrink-0 text-xs font-medium text-slate-500">
            {{ $t('v1.view.main.dashboard.org.setting.staff.guild') }}
          </div>
          <Search
            :placeholder="$t('v1.view.main.dashboard.org.setting.staff.find')"
          />
        </div>
        <EmptyActive v-if="!size(list_new_staff)" />
        <template v-else>
          <div class="h-full p-2 overflow-y-auto flex flex-col gap-2.5">
            <div class="grid grid-cols-2 gap-x-6 gap-y-2.5">
              <template v-for="staff of list_new_staff">
                <ActorItem
                  @click="selectStaff(staff?.user_id)"
                  v-if="filterStaff(staff)"
                  class="cursor-pointer"
                >
                  <template #before-avatar>
                    <Checkbox
                      v-if="staff?.user_id"
                      v-model="list_selected_staff_id[staff?.user_id]"
                      class="flex-shrink-0"
                    />
                  </template>
                  <template #avatar>
                    <StaffAvatar
                      :id="staff?.user_id"
                      class="w-8 h-8 rounded-oval"
                    />
                  </template>
                  <template #name>
                    {{ staff?.name }}
                  </template>
                  <template #after-name> </template>
                </ActorItem>
              </template>
            </div>
          </div>
          <div class="flex-shrink-0 flex justify-end p-2 border-t">
            <Button
              @click="activeStaff"
              :class="
                isAllowAction()
                  ? 'bg-blue-700 text-white'
                  : 'cursor-not-allowed bg-slate-200 text-slate-500'
              "
            >
              {{ $t('v1.common.more') }}
            </Button>
          </div>
        </template>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { useConnectPageStore, useOrgStore } from '@/stores'
import { ref } from 'vue'
import { useCommonStore } from '@/stores'
import { filter, keyBy, map, mapValues, size } from 'lodash'
import { eachOfLimit } from 'async'
import { nonAccentVn } from '@/service/helper/format'
import { add_ms, read_ms } from '@/service/api/chatbox/billing'
import { toastError } from '@/service/helper/alert'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'

import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
import Search from '@/views/Dashboard/ConnectPage/Search.vue'
import Button from '@/views/Dashboard/ConnectPage/Button.vue'
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import EmptyActive from '@/views/Dashboard/ConnectPage/ActivePage/EmptyActive.vue'
import Checkbox from '@/components/Checkbox.vue'

import type { StaffInfo } from '@/service/interface/app/staff'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'

const $emit = defineEmits(['done'])

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()

/**ref của modal kết nối nền tảng */
const modal_member_ship_ref = ref<InstanceType<typeof Modal>>()
/**danh sách các trang mới */
const list_new_staff = ref<StaffInfo[]>([])
/**danh sách id các page đã chọn */
const list_selected_staff_id = ref<Record<string, boolean>>({})
/**loading */
const is_loading = ref(false)

/**ẩn hiện modal của component */
function toggleModal() {
  modal_member_ship_ref.value?.toggleModal()
}
/**hiển thị các nhân viên theo tìm kiếm */
function filterStaff(staff: StaffInfo) {
  // lọc bỏ các nhân viên cũ không có user_id mới
  if (!staff?.user_id) return false

  // nếu không có giá trị tìm kiếm thì luôn hiển thị
  if (!connectPageStore.search) return true

  /**giá trị tìm kiếm đã được xử lý */
  const SEARCH = nonAccentVn(connectPageStore.search)

  /**tên nhân viên đã xử lý */
  const STAFF_NAME = nonAccentVn(staff?.name || '')

  // lọc theo id hoặc tên nhân viên
  return (
    staff?.user_id?.includes(SEARCH) ||
    staff?.fb_staff_id?.includes(SEARCH) ||
    STAFF_NAME?.includes(SEARCH)
  )
}
/**thêm các nhân viên được chọn vào tổ chức */
async function activeStaff() {
  // nếu không có nhân viên nào được chọn thì bỏ qua
  if (!isAllowAction()) return

  // hiển thị loading
  commonStore.is_loading_full_screen = true

  try {
    // lặp qua từng nhân viên được chọn
    await eachOfLimit(
      list_selected_staff_id.value,
      1,
      async (value, staff_id) => {
        // nếu nhân viên không được chọn thì bỏ qua
        if (!value || !staff_id || !orgStore.selected_org_id) return

        // thêm nhân viên vào tổ chức
        await add_ms(orgStore.selected_org_id, staff_id as string)
      }
    )

    // làm mới danh sách nhân viên được chọn
    list_selected_staff_id.value = {}

    // thông báo thành công
    $emit('done')

    // tắt modal
    toggleModal()
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // ẩn loading
  commonStore.is_loading_full_screen = false
}
/**lấy danh sách các nhân viên không thuộc tổ chức hiện tại */
async function getAnotherOrgStaff() {
  try {
    // hiển thị loading
    is_loading.value = true

    // nếu không có id tổ chức thì thôi
    if (!orgStore.selected_org_id) return

    // xóa toàn bộ danh sách trang cũ
    list_new_staff.value = []
    // xóa toàn bộ trang đã chọn
    list_selected_staff_id.value = {}

    /**toàn bộ các nhân viên trong page */
    const { all_staff_list: LIST_STAFF } =
      await new N4SerivceAppPage().getListPage()

    /**các staff đã nằm trong tổ chức */
    const LIST_MS = await read_ms(orgStore.selected_org_id)

    /**page_id và org_id */
    const MAP_OS_ID = mapValues(keyBy(LIST_MS, 'staff_id'), 'org_id')

    // lặp qua toàn bộ danh sách trang của người dùng
    map(LIST_STAFF, staff => {
      // nếu không có id nhân viên thì thôi
      if (!staff.user_id) return

      // lọc ra nhân viên đã ở trong tổ chức rồi
      if (MAP_OS_ID[staff.user_id] === orgStore.selected_org_id) return

      // thêm nhân viên chưa kích hoạt vào danh sách
      list_new_staff.value.push(staff)
    })
  } catch (e) {
    // thông báo lỗi
    ToastSingleton.getInst().error(e)
  } finally {
    // ẩn loading
    is_loading.value = false
  }
}
/**toggle nhân viên */
function selectStaff(staff_id?: string) {
  // nếu không có id nhân viên thì thôi
  if (!staff_id) return

  // thay đổi cờ select của nhân viên này
  list_selected_staff_id.value[staff_id] =
    !list_selected_staff_id.value[staff_id]
}
/**có cho phép thực hiện hành động không */
function isAllowAction(): boolean {
  /**lọc ra danh sách id các nhân viên đang chọn */
  const LIST_SELECT_STAFF_ID = filter(
    list_selected_staff_id.value,
    value => value
  )

  /**
   * trả về số lượng id nhân viên đang chọn
   * phải chọn nhân viên thì mới cho phép thực hiện hành động
   */
  const COUNT_SELECTED_STAFF = size(LIST_SELECT_STAFF_ID)
  /**tổng số nhân viên của tổ chức sau khi thêm */
  const NEW_TOTAL_STAFF =
    COUNT_SELECTED_STAFF +
    (orgStore.selected_org_info?.org_package?.org_current_staff || 0)
  /**số lượng nhân viên sau khi thêm có vượt mức giới hạn không */
  const IS_NOT_REACH_QUOTA =
    NEW_TOTAL_STAFF <=
    (orgStore.selected_org_info?.org_package?.org_quota_staff || 0)

  // phải chọn nhân viên, nhưng không được quá giới hạn
  return !!COUNT_SELECTED_STAFF && IS_NOT_REACH_QUOTA
}

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal })
</script>
