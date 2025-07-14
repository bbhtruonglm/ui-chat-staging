<template>
  <Popover
    ref="filter_popover_ref"
    :is_fit="false"
    width="450px"
    height="500px"
    position="RIGHT"
    :back="350"
  >
    <Staff
      v-model:staff_list="staff_list"
      v-model:snap_staffs="snap_staffs"
    />
  </Popover>
  <Dropdown
    ref="filter_dropdown_ref"
    :is_fit="false"
    width="450px"
    height="500px"
    position="RIGHT"
    :back="350"
  >
    <Staff
      v-model:staff_list="staff_list"
      v-model:snap_staffs="snap_staffs"
    />
  </Dropdown>
</template>
<script setup lang="ts">
import { useConversationStore, usePageStore } from '@/stores'
import { map, mapValues, sortBy } from 'lodash'
import { ref, watch } from 'vue'

import Dropdown from '@/components/Dropdown.vue'
import Popover from '@/components/Popover.vue'
import Staff from '@/views/ChatWarper/Menu/FilterModal/Content/Staff.vue'

import type { StaffInfo } from '@/service/interface/app/staff'
import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** Danh sách nhân viên */
const staff_list = ref<StaffInfo[]>([])
/** Danh sách nhân viên */
const snap_staffs = ref<{ [index: string]: StaffInfo }>({})
/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()
/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()

watch(
  () => pageStore.selected_page_list_info,
  () => getStaffs()
)

/** lắng nghe khi clear filter */
watch(
  () => conversationStore.option_filter_page_data.staff_id,
  (value) => {
    // nếu có giá trị thì thôi
    if(value) return

    // loại bỏ gắn cờ
    unselectStaff()
  }
)

/** Xoá lọc */
function clearThisFilter() {
  // xoá store lọc
  delete conversationStore.option_filter_page_data.staff_id

  // loại bỏ gắn cờ
  unselectStaff()
}

/** loại bỏ gắn cờ */
function unselectStaff() {
  staff_list.value = staff_list.value.map(staff => {
    staff.is_selected = false

    return staff
  })
}

/** Lấy danh sách nhân viên */
function getStaffs() {
  // lưu lại danh sách nhãn gốc dưới dạng obj
  map(pageStore.selected_page_list_info, item => {
    snap_staffs.value = {
      ...snap_staffs.value,
      ...mapValues(item.staff_list, staff => {
        // gắn toàn bộ nhãn cờ chưa chọn để tránh lỗi khi sort
        staff.is_selected = false

        return staff
      }),
    }
  })

  // đánh dấu các staff đã được chọn
  staff_list.value = map(snap_staffs.value, staff => {
    // check từ store
    if (
      conversationStore.option_filter_page_data.staff_id?.includes(
        staff?.fb_staff_id
      )
    )
      staff.is_selected = true

    return staff
  })

  // lọc đã chọn lên đầu
  staff_list.value = sortStaff(staff_list.value)
}
/**đưa các staff được chọn lên đầu */
function sortStaff(input: StaffInfo[]) {
  return sortBy(input, 'is_selected').reverse()
}

defineExpose({ filter_popover_ref, filter_dropdown_ref, clearThisFilter })
</script>
