<template>
  <EmptyPage
    :icon="ZaloIcon"
    :guild="$t('v1.view.main.dashboard.select_platform.zalo_oa.guild', {
        partner: commonStore.partner?.name,
      })"
    :description="
      $t('v1.view.main.dashboard.select_platform.zalo_oa.description')
    "
    class_guild="w-[482px]"
  >
    <template #after-description>
      <span class="cursor-pointer relative">
        <span class="text-sm font-medium decoration underline">
          {{ $t('v1.view.main.dashboard.select_platform.zalo_oa.lean_more') }}
        </span>
        <NewTabIcon class="w-4 h-4 text-gray-500 absolute top-0 -right-5" />
      </span>
    </template>
    <template #button>
      <ZaloOA
        @done="connectPageStore.selectMenu('PAGE')"
        :text="$t('Kết nối với Zalo OA')"
      />
    </template>
  </EmptyPage>
</template>
<script setup lang="ts">
import { useCommonStore, useConnectPageStore } from '@/stores'

import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'
import ZaloOA from '@/components/OAuth/ZaloOA.vue'

import ZaloIcon from '@/components/Icons/Zalo.vue'
import NewTabIcon from '@/components/Icons/NewTab.vue'

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
</script>
