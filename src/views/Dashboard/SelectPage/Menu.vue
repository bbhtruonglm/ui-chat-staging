<template>
  <MenuItem
    id="dashboard__menu-left"
    @click="selectPageStore.selectMenu(key)"
    v-for="{ key, title, icon, class_icon } of list_platform"
    :icon="icon ?? SquareIcon"
    :title="title"
    :is_selected="isSelectedMenu(key)"
    :class_icon="class_icon"
  />
</template>
<script setup lang="ts">
import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'
import { useI18n } from 'vue-i18n'
import { ref, markRaw } from 'vue'
import { useSelectPageStore } from '@/stores'
import { composableService } from '@/views/Dashboard/ConnectPage/service'

import SquareIcon from '@/components/Icons/Square.vue'

import type { Component } from 'vue'
import type { ISelectPlatform } from './type'

const { ICON_MAP } = composableService()

const { t: $t } = useI18n()
const selectPageStore = useSelectPageStore()

/** một phần tử của nền tảng */
interface PlatformItem {
  /** Khóa */
  key: ISelectPlatform
  /** Tiêu đề */
  title: string
  /** Icon vue */
  icon?: Component
  /** Icon class custom */
  class_icon?: string
}

/** Danh sách các nền tảng */
const list_platform = ref<PlatformItem[]>(getPlatform())

/** Kiểm tra xem menu có được chọn không */
function isSelectedMenu(key: string) {
  return key === selectPageStore.current_menu
}
/**khởi tạo danh sách menu */
function getPlatform(): PlatformItem[] {
  /** Menu mặc định */
  const DEFAULT_MENU: PlatformItem[] = [
    {
      key: 'ALL_PLATFORM',
      title: $t('v1.common.all'),
      icon: markRaw(SquareIcon),
    },
    // {
    //   key: 'RECENT',
    //   title: $t('v1.common.recent'),
    //   icon: markRaw(ClockIcon),
    // },
  ]

  /** Danh sách nền tảng */
  const LIST_PLATFORM_MENU: PlatformItem[] = $env.platform?.map(
    platform_key => ({
      key: platform_key,
      title: $t(`v1.common.${platform_key.toLowerCase()}`),
      icon: ICON_MAP[platform_key],
      class_icon: 'w-4 h-4',
    })
  )

  // Trả về danh sách menu
  return [...DEFAULT_MENU, ...LIST_PLATFORM_MENU]
}
</script>
