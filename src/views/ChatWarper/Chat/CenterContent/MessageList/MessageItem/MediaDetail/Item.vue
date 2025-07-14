<template>
  <div class="overflow-hidden flex justify-center flex-grow min-h-0 h-full">
    <img
      v-if="data_source?.image?.url"
      :src="url || data_source?.image?.url"
      class="attachment-size"
    />
    <template v-if="data_source?.video?.url">
      <video
        v-if="!is_mini"
        class="attachment-size"
        controls
        preload="metadata"
      >
        <source
          :src="url || data_source?.video?.url"
          type="video/mp4"
        />
      </video>
      <img
        v-else
        class="attachment-size"
        src="@/assets/icons/play.svg"
      />
    </template>
    <template v-if="data_source?.audio?.url && url">
      <Audio
        v-if="!is_mini"
        :src="url || data_source?.audio?.url"
        class="w-full p-3"
      />
      <img
        v-else
        class="attachment-size"
        src="@/assets/icons/audio.svg"
      />
    </template>
    <div
      v-if="data_source?.file?.url"
      class="message-box bg-white flex flex-col items-end text-slate-700"
    >
      <div class="p-2 rounded-full bg-slate-300 w-9 h-9">
        <DocumentIcon class="w-5 h-5" />
      </div>
      <div class="text-sm truncate min-w-0 w-full underline">
        {{ getFileName(data_source?.file?.url) }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getFileName } from '@/service/helper/queryString'

import Audio from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Media/Audio.vue'

import DocumentIcon from '@/components/Icons/Document.vue'

import type { MessageTemplateInput } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu */
    data_source?: MessageTemplateInput
    /**link media */
    url?: string
    /**hiển thị cỡ nhỏ */
    is_mini?: boolean
  }>(),
  {}
)
</script>
<style lang="scss" scoped>
.attachment-size {
  @apply h-full object-contain rounded-lg;
}
</style>
