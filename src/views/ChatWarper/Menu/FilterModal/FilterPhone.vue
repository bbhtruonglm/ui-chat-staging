<template>
  <Popover
    ref="filter_popover_ref"
    position="RIGHT"
    :is_fit="false"
    width="349px"
    height="auto"
    class_content="flex flex-col gap-1"
  >
    <Phone />
  </Popover>
  <Dropdown
    ref="filter_dropdown_ref"
    position="RIGHT"
    :is_fit="false"
    width="349px"
    height="auto"
    class_content="flex flex-col gap-1"
  >
    <Phone />
  </Dropdown>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { ref } from 'vue'

import Popover from '@/components/Popover.vue'
import Dropdown from '@/components/Dropdown.vue'
import Phone from '@/views/ChatWarper/Menu/FilterModal/Content/Phone.vue'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<InstanceType<typeof Popover>>()

/**ref của dropdown */
const filter_dropdown_ref = ref<InstanceType<typeof Dropdown>>()

/**xoá lọc này */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.have_phone
}

defineExpose({ filter_popover_ref, filter_dropdown_ref, clearThisFilter })
</script>
