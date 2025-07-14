<template>
  <MenuTitle :title="$t('v1.view.main.dashboard.chat.filter.label.title')" />
  <div
    class="py-3 grid gap-2"
    :class="{
      'grid-cols-1':
        Object.keys(pageStore.selected_page_list_info).length === 1,
      'grid-cols-2': Object.keys(pageStore.selected_page_list_info).length > 1,
    }"
  >
    <SelectPage
      v-if="Object.keys(pageStore.selected_page_list_info).length > 1"
      :select_page="filterLabelByPage"
    />
    <input
      ref="search_ref"
      type="text"
      :placeholder="$t('Tìm kiếm nhãn')"
      class="border px-3 py-1 rounded-lg focus:outline-none text-sm"
      v-on:keyup="searchLabel"
      v-model="label_search_name"
    />
  </div>
  <div class="flex justify-between py-3 border-t border-b">
    <p>
      {{ $t('v1.view.main.dashboard.chat.filter.label.filteration_condition') }}
    </p>
    <div class="flex items-center">
      <p class="mr-3">
        {{ $t('v1.view.main.dashboard.chat.filter.label.or') }}
      </p>
      <input
        :checked="!conversationStore.option_filter_page_data.label_and"
        :value="false"
        v-model="conversationStore.option_filter_page_data.label_and"
        type="radio"
        class="accent-orange-600 w-[20px] h-[20px]"
      />
      <p class="mr-3 ml-8">
        {{ $t('v1.view.main.dashboard.chat.filter.label.and') }}
      </p>
      <input
        v-model="conversationStore.option_filter_page_data.label_and"
        :value="true"
        :checked="conversationStore.option_filter_page_data.label_and"
        type="radio"
        class="accent-orange-600 w-[20px] h-[20px] mr-3"
      />
    </div>
  </div>
  <div class="h-[calc(100%_-_136px)] overflow-y-auto">
    <TagItem
      :is_disable="isDisableLabel(index)"
      v-for="(item, index) of label_list"
      v-show="item.show_label"
      @click="selectLabel(index)"
      :label="item"
      :is_selected="item?.is_selected"
    />
  </div>
</template>
<script setup lang="ts">
import { nonAccentVn } from '@/service/helper/format'
import { useConversationStore, usePageStore } from '@/stores'
import { debounce, map, size, sortBy } from 'lodash'
import { ref } from 'vue'

import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'
import SelectPage from '@/views/ChatWarper/Menu/FilterModal/Tag/SelectPage.vue'
import TagItem from '@/views/ChatWarper/Menu/FilterModal/Tag/TagItem.vue'

import type { ILabel } from '@/service/interface/app/label'
import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** Danh sách label của page đang được chọn */
const label_list = defineModel<ILabel[]>('label_list', {
  default: [],
  required: true,
})

/** Snap label của page đang được chọn */
const snap_labels = defineModel<{ [index: string]: ILabel }>('snap_labels', {
  default: {},
  required: true,
})
/** ID page hiện tại đang được chọn */
const label_search_name = ref<string>('')
/**ref của dropdown search */
const search_ref = ref<ComponentRef>()

/**chặn các nhãn đã được bên đối diện lựa chọn */
function isDisableLabel(index: number) {
  /**nhãn được chọn */
  const SELECTED_LABEL = label_list.value?.[index]
  /**dữ liệu filter */
  const FILTER = conversationStore.option_filter_page_data

  // nếu bên lọc nhãn đã chọn thì bỏ qua
  return FILTER.not_label_id?.includes(SELECTED_LABEL._id)
}
/** Chọn nhãn */
function selectLabel(index: number) {
  /**nhãn được chọn */
  const SELECTED_LABEL = label_list.value?.[index]
  /**dữ liệu filter */
  const FILTER = conversationStore.option_filter_page_data

  // nếu không có nhãn được chọn thì dừng
  if (!SELECTED_LABEL) return

  // nếu bên lọc nhãn đã chọn thì bỏ qua
  if (isDisableLabel(index)) return

  // toggle nhãn
  SELECTED_LABEL.is_selected = !SELECTED_LABEL.is_selected

  /**danh sách id nhãn đã chọn */
  let list_id = label_list.value
    ?.filter(label => label.is_selected)
    ?.map(label => label._id)

  // lưu lại id nhãn đã chọn vào store
  FILTER.label_id = size(list_id) ? list_id : undefined

  // sort đã chọn lên đầu
  label_list.value = sortLabel(label_list.value)
}
/**đưa các label được chọn lên đầu */
function sortLabel(input: ILabel[]) {
  return sortBy(input, 'is_selected').reverse()
}
/** Tìm kiếm nhãn theo tên */
const searchLabel = debounce(($event: Event) => {
  // nếu không tìm kiếm thì hiển thị toàn bộ
  if (!label_search_name.value)
    return (label_list.value = sortLabel(map(snap_labels.value)))

  // lọc các nhãn thoả mãn tìm kiếm
  let temp: ILabel[] = map(snap_labels.value).filter((item: ILabel) =>
    nonAccentVn(item.title).includes(nonAccentVn(label_search_name.value))
  )

  label_list.value = sortLabel(temp)
}, 300)
/** Hiển thị nhãn theo page đã chọn */
function filterLabelByPage(page_id: string) {
  if (!page_id) {
    // * Hiển thị toàn bộ label
    label_list.value = label_list.value.map(label => {
      label.show_label = true
      return label
    })
  } else {
    // * Gắn cờ hiển thị từng label theo page đã chọn
    label_list.value = label_list.value.map(label => {
      if (label.fb_page_id === page_id) label.show_label = true
      else label.show_label = false
      return label
    })
  }

  // * Sort lại label
  label_list.value = sortLabel(label_list.value)

  // * Xóa input tìm kiếm nhãn
  label_search_name.value = ''
}
</script>
