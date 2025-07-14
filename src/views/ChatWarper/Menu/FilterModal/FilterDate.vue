<template>
  <Popover
    ref="filter_popover_ref"
    :is_fit="false"
    width="450px"
    height="auto"
    position="RIGHT"
    :back="150"
  >
    <Date />
  </Popover>
  <Dropdown
    ref="filter_dropdown_ref"
    :is_fit="false"
    width="450px"
    height="auto"
    position="RIGHT"
    :back="150"
    >
      <Date />
    </Dropdown>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { ref } from 'vue'

import Popover from '@/components/Popover.vue'
import Dropdown from '@/components/Dropdown.vue'
import Date from '@/views/ChatWarper/Menu/FilterModal/Content/Date.vue'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()

/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()

/**xoá lọc này */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.time_range
}

defineExpose({ filter_popover_ref, filter_dropdown_ref, clearThisFilter })
</script>
