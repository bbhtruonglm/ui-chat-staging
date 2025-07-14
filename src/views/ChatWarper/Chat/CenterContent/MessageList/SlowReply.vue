<template>
  <template v-if="duration">
    <div class="h-4" />
    <div class="text-xs absolute w-max bottom-0">
      {{ $date_handle.formatShort(time) }}
      <template v-if="next_message">
        {{ $t('v1.view.main.dashboard.chat.message.reply_time') }}:
      </template>
      <template v-else>
        {{ $t('v1.view.main.dashboard.chat.message.reply_time_not_rep') }}:
      </template>
      <span class="text-red-500">{{ duration }}</span>
    </div>
  </template>
</template>
<script setup lang="ts">
import type { MessageInfo } from '@/service/interface/app/message'
import { DateHandle } from '@/utils/helper/DateHandle';
import { container } from 'tsyringe';

const $props = withDefaults(
  defineProps<{
    /**số thời gian rep chậm */
    duration?: string
    /**tin nhắn tiếp theo */
    next_message?: MessageInfo
    /**thời gian của tin nhắn */
    time?: string
  }>(),
  {}
)

const $date_handle = container.resolve(DateHandle)
</script>
