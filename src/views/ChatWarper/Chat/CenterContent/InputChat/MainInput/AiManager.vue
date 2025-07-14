<template>
  <AiIcon
    @click="ai_manager_ref?.toggleDropdown"
    v-tooltip="$t('v1.view.main.dashboard.chat.input.ai.title')"
    :class="{
      'text-slate-700': ai_manager_ref?.is_open,
    }"
    class="w-5 h-5 cursor-pointer text-slate-400 flex-shrink-0 hover:text-slate-700 my-1.5"
  />
  <Dropdown
    ref="ai_manager_ref"
    width="349px"
    height="auto"
    :is_fit="false"
    position="TOP"
    :back="20"
    :distance="10"
    class_content="flex flex-col gap-1"
  >
    <MenuItem
      @click="auto_tag_ref?.click()"
      :icon="BookmarkIcon"
      :title="$t('v1.view.main.dashboard.chat.input.ai.auto_label')"
    >
      <Checkbox ref="auto_tag_ref" />
    </MenuItem>
    <MenuItem
      @click="auto_translate_ref?.click()"
      :icon="TranslateIcon"
      :title="$t('v1.view.main.dashboard.chat.input.ai.auto_translate')"
    >
      <Checkbox ref="auto_translate_ref" />
    </MenuItem>
    <hr />
    <MenuItem
      :icon="AiBoldIcon"
      :title="$t('v1.view.main.dashboard.chat.input.ai.manager_plugin')"
    >
      <div class="text-gray-500 text-xs font-medium">⌘P</div>
      <ArrowDownIcon class="text-gray-500 w-3 h-3 -rotate-90" />
    </MenuItem>
  </Dropdown>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Dropdown from '@/components/Dropdown.vue'
import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'
import Checkbox from '@/components/Checkbox.vue'

import AiIcon from '@/components/Icons/Ai.vue'
import BookmarkIcon from '@/components/Icons/Bookmark.vue'
import TranslateIcon from '@/components/Icons/Translate.vue'
import AiBoldIcon from '@/components/Icons/AiBold.vue'
import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'

/**ref của dropdown */
const ai_manager_ref = ref<InstanceType<typeof Dropdown>>()
const auto_tag_ref = ref<InstanceType<typeof Checkbox>>()
const auto_translate_ref = ref<InstanceType<typeof Checkbox>>()
</script>
