<template>
  <Dropdown
    :teleport_to="'#filter_popover_ref'"
    ref="filter_dropdown_ref"
    :is_fit="false"
    width="400px"
    height="430px"
    position="RIGHT"
    :back="350"
		:distance="20"
		:class_container="'!fixed'"
  >
    <DatePicker
      :max_another_range="end_time"
      v-model="start_time"
      class="border rounded-xl mt-1"
      @update:model-value="updateTime('start_time')"
    />
    <DatePicker
      :min_another_range="start_time"
      v-model="end_time"
      class="border rounded-xl mt-1"
      @update:model-value="updateTime('end_time')"
    />
  </Dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Dropdown from '@/components/Dropdown.vue'
import DatePicker from '@/components/DatePicker.vue'

import type { ComponentRef } from '@/service/interface/vue'

const $props = withDefaults(
  defineProps<{
    time_range: {
      start_time: number
      end_time: number
    }
    time_picked: Function
  }>(),
  {}
)

/** Ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()
/** Thời gian bắt đầu */
const start_time = ref<number>($props.time_range.start_time)
/** Thời gian kết thúc */
const end_time = ref<number>($props.time_range.end_time)

/** Hiển thị */
function toggle($event: MouseEvent) {
  // nếu là pc thỉ mở dropdown
  filter_dropdown_ref.value?.toggleDropdown($event)
}
/** Update khi thời gian thay đổi */
function updateTime(type: string) {
  $props.time_picked(start_time.value, end_time.value)
}

defineExpose({ toggle })
</script>
