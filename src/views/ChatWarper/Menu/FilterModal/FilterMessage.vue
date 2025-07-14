<template>
  <Popover
    ref="filter_popover_ref"
    position="RIGHT"
    :is_fit="false"
    width="349px"
    height="auto"
    class_content="flex flex-col gap-1"
  >
    <Message />
  </Popover>
  <Dropdown
    ref="filter_dropdown_ref"
    position="RIGHT"
    :is_fit="false"
    width="349px"
    height="auto"
    class_content="flex flex-col gap-1"
  >
    <Message />
  </Dropdown>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores';
import { ref } from 'vue';

import Popover from '@/components/Popover.vue';
import Dropdown from '@/components/Dropdown.vue';
import Message from '@/views/ChatWarper/Menu/FilterModal/Content/Message.vue';

import type { ComponentRef } from '@/service/interface/vue';

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()
/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()


/**loại bỏ lọc */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.unread_message
  delete conversationStore.option_filter_page_data.not_response_client
  delete conversationStore.option_filter_page_data.not_exist_label
  conversationStore.option_filter_page_data.is_spam_fb = 'NO'
}

defineExpose({ filter_popover_ref, filter_dropdown_ref, clearThisFilter })
</script>
