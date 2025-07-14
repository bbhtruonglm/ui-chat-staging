<template>
  <ActorItem class="cursor-pointer bg-white">
    <template #avatar>
      <WidgetAvatar
        :src="widget?.icon"
        class="w-8 h-8 rounded-oval bg-gray-200"
      />
    </template>
    <template #name>
      <div class="text-sm font-medium truncate">
        {{ widget?.name }}
      </div>
    </template>
    <template #after-name> 
      <slot />
    </template>
    <template #description>
      <div class="truncate text-xs text-slate-500">
        {{ widget?.description }}
      </div>
    </template>
  </ActorItem>
</template>
<script setup lang="ts">
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'
import WidgetAvatar from '@/views/Dashboard/Widget/WidgetAvatar.vue'

import type { AppInfo, AppInstalledInfo } from '@/service/interface/app/widget'

const $emit = defineEmits([
  'delete',
  'setting',
  'toggle',
  'link',
  'tranfer',
  'install',
  'key',
])

const $props = withDefaults(
  defineProps<{
    /**giá trị widget đang chọn */
    widget?: AppInfo
    /**dữ liệu widget được cài đặt */
    app?: AppInstalledInfo
    /**hiển thị các button điều khiển */
    is_control?: boolean
    /**hiển thị các button điều khiển của người tạo */
    is_owner_control?: boolean
    /**ẩn nút xoá */
    disable_delete?: boolean
  }>(),
  {}
)
</script>
