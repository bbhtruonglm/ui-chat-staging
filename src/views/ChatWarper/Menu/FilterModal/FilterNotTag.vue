<template>
  <Popover
    ref="filter_popover_ref"
    :is_fit="false"
    width="450px"
    height="500px"
    position="RIGHT"
    :back="300"
  >
    <NotTag
      v-model:label_list="label_list"
      v-model:snap_labels="snap_labels"
    />
  </Popover>
  <Dropdown
    ref="filter_dropdown_ref"
    :is_fit="false"
    width="450px"
    height="500px"
    position="RIGHT"
    :back="300"
  >
    <NotTag
      v-model:label_list="label_list"
      v-model:snap_labels="snap_labels"
    />
  </Dropdown>
</template>
<script setup lang="ts">
import { copy } from '@/service/helper/format'
import { useConversationStore, usePageStore } from '@/stores'
import { isString, map, mapValues, sortBy } from 'lodash'
import { onMounted, ref, watch } from 'vue'

import Dropdown from '@/components/Dropdown.vue'
import Popover from '@/components/Popover.vue'
import NotTag from '@/views/ChatWarper/Menu/FilterModal/Content/NotTag.vue'

import type { ILabel } from '@/service/interface/app/label'
import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** Danh sách label của page đang được chọn */
const label_list = ref<ILabel[]>([])
/** Snap label của page đang được chọn */
const snap_labels = ref<{ [index: string]: ILabel }>({})
/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()
/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()

watch(
  () => pageStore.selected_page_list_info,
  () => getLabelList()
)

/** lắng nghe khi clear filter */
watch(
  () => conversationStore.option_filter_page_data.not_label_id,
  (value) => {
    // nếu có giá trị thì thôi
    if(value) return

    // loại bỏ gắn cờ
    unselectLabel()
  }
)

onMounted(() => {
  /**Trường hợp điều kiện lọc theo nhãn and là string thì ghi đè lại thành boolean  */
  if (isString(conversationStore.option_filter_page_data.label_and)) {
    conversationStore.option_filter_page_data.label_and = false
  }
})

/** Xoá lọc */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.not_label_id

  // loại bỏ gắn cờ
  unselectLabel()
}

/** loại bỏ gắn cờ */
function unselectLabel() {
  label_list.value = label_list.value.map(label => {
    label.is_selected = false

    return label
  })
}

/** Lấy danh sách nhãn */
function getLabelList() {
  // lưu lại danh sách nhãn gốc dưới dạng obj
  map(pageStore.selected_page_list_info, item => {
    /**tạo ra obj mới để tránh lỗi trùng lặp lựa chọn */
    const ORIGIN_PAGE_LIST_LABEL: Record<string, ILabel> = copy(
      mapValues(item.label_list, label => {
        // gắn toàn bộ nhãn cờ chưa chọn để tránh lỗi khi sort
        label.is_selected = false

        return label
      })
    )

    // gộp vào snap label
    snap_labels.value = { ...snap_labels.value, ...ORIGIN_PAGE_LIST_LABEL }
  })

  // đánh dấu các label đã được chọn
  label_list.value = map(snap_labels.value, label => {
    // check từ store
    if (
      conversationStore.option_filter_page_data.not_label_id?.includes(
        label?._id
      )
    )
      label.is_selected = true

    // * Gắn cờ hiển thị
    label.show_label = true

    return label
  })

  // lọc đã chọn lên đầu
  label_list.value = sortLabel(label_list.value)
}
/**đưa các label được chọn lên đầu */
function sortLabel(input: ILabel[]) {
  return sortBy(input, 'is_selected').reverse()
}

defineExpose({ filter_popover_ref, filter_dropdown_ref, clearThisFilter })
</script>
