<template>
  <MenuTitle :title="$t('v1.view.main.dashboard.chat.filter.phone.title')" />
  <FilterCheckbox
    true_value="YES"
    :false_value="undefined"
    v-model="conversationStore.option_filter_page_data.have_phone"
    :icon="PhoneIcon"
    :title="$t('v1.view.main.dashboard.chat.filter.phone.include_phone')"
  />
  <FilterCheckbox
    true_value="NO"
    :false_value="undefined"
    v-model="conversationStore.option_filter_page_data.have_phone"
    :icon="MinusIcon"
    :title="$t('v1.view.main.dashboard.chat.filter.phone.exclude_phone')"
  />
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'

import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'
import FilterCheckbox from '@/views/ChatWarper/Menu/FilterModal/FilterCheckbox.vue'

import MinusIcon from '@/components/Icons/Minus.vue'
import PhoneIcon from '@/components/Icons/Phone.vue'

const conversationStore = useConversationStore()
</script>
