<template>
  <MenuTitle :title="$t('v1.view.main.dashboard.chat.filter.message.title')" />
  <FilterCheckbox
    v-model="conversationStore.option_filter_page_data.unread_message"
    true_value="true"
    :false_value="undefined"
    :icon="ChatDotIcon"
    :title="$t('v1.view.main.dashboard.chat.filter.message.unread')"
  />
  <FilterCheckbox
    v-model="conversationStore.option_filter_page_data.not_response_client"
    true_value="true"
    :false_value="undefined"
    :icon="ChatIcon"
    :title="$t('v1.view.main.dashboard.chat.filter.message.not_reply')"
  />
  <FilterCheckbox
    v-model="conversationStore.option_filter_page_data.not_exist_label"
    true_value="true"
    :false_value="undefined"
    :icon="TagNotIcon"
    :title="$t('v1.view.main.dashboard.chat.filter.message.not_tag')"
  />
  <FilterCheckbox
    true_value="YES"
    false_value="NO"
    v-model="conversationStore.option_filter_page_data.is_spam_fb"
    :icon="MinusIcon"
    :title="$t('v1.view.main.dashboard.chat.filter.message.spam')"
  />
</template>

<script setup lang="ts">
import { useConversationStore } from '@/stores'

import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'
import FilterCheckbox from '@/views/ChatWarper/Menu/FilterModal/FilterCheckbox.vue'

import ChatIcon from '@/components/Icons/Chat.vue'
import ChatDotIcon from '@/components/Icons/ChatDot.vue'
import MinusIcon from '@/components/Icons/Minus.vue'
import TagNotIcon from '@/components/Icons/TagNot.vue'

const conversationStore = useConversationStore()
</script>
