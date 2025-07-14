<template>
  <Popover
    ref="filter_popover_ref"
    position="RIGHT"
    :is_fit="false"
    width="349px"
    height="auto"
    class_content="flex flex-col gap-1"
  >
    <Interact />
  </Popover>
  <Dropdown
    ref="filter_dropdown_ref"
    width="349px"
    height="auto"
    :is_fit="false"
    position="RIGHT"
    :distance="9"
    class_content="flex flex-col gap-1"
  >
    <Interact />
  </Dropdown>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores';
import { ref } from 'vue';

import Dropdown from '@/components/Dropdown.vue';
import Popover from '@/components/Popover.vue';
import Interact from '@/views/ChatWarper/Menu/FilterModal/Content/Interact.vue';

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<InstanceType<typeof Popover>>()

/**ref của dropdown */
const filter_dropdown_ref = ref<InstanceType<typeof Dropdown>>()

/**xoá lọc */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.display_style
}

defineExpose({ filter_popover_ref, clearThisFilter, filter_dropdown_ref })
</script>
