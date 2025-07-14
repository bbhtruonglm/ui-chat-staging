<template>
  <div class="flex flex-col justify-center items-center gap-2.5 h-full">
    <div class="p-4 bg-gray-100 rounded-full">
      <LayerIcon class="w-7 h-7 text-slate-700" />
    </div>
    <div class="font-semibold">
      {{ $t('v1.view.main.dashboard.select_platform.empty_invite') }}
    </div>
    <div class="text-sm text-slate-700 text-center w-[405px]">
      {{ $t('v1.view.main.dashboard.select_platform.empty_invite_guild') }}
    </div>
    <div
      class="flex items-center gap-2.5 overflow-x-auto w-full justify-center"
    >
      <button
        v-for="{ key, title, icon } of LIST_PLATFORM_MENU"
        @click="connectPageStore.selectMenu(key)"
        class="py-2 px-4 rounded-md bg-slate-100 text-sm font-medium flex items-center gap-2 flex-shrink-0"
      >
        <component
          :is="icon"
          class="w-4 h-4"
        />
        {{ title }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { composableService } from '@/views/Dashboard/ConnectPage/service'
import { useConnectPageStore } from '@/stores'
import { useI18n } from 'vue-i18n'

import LayerIcon from '@/components/Icons/Layer.vue'

import type { Component } from 'vue'

const { ICON_MAP } = composableService()

const { t: $t } = useI18n()
const connectPageStore = useConnectPageStore()

/** một phần tử của nền tảng */
interface PlatformItem {
  /** Khóa */
  key: string
  /** Tiêu đề */
  title: string
  /** Icon vue */
  icon?: Component
}

/** Danh sách nền tảng */
const LIST_PLATFORM_MENU: PlatformItem[] = $env.platform?.map(platform_key => ({
  key: platform_key,
  title: $t(`v1.common.${platform_key.toLowerCase()}`),
  icon: ICON_MAP[platform_key],
}))
</script>
