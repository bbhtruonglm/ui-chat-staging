<template>
  <div
    id="chat__message-template"
    :class="is_fix_size ? 'w-[300px]' : 'max-w-[300px]'"
    class="rounded-lg p-2 gap-2.5 flex flex-col flex-shrink-0"
  >
    <div
      v-if="isHaveFileAttachment() || data_source?.is_ai"
      class="flex justify-between gap-2"
    >
      <Media
        v-if="isHaveFileAttachment()"
        :data_source
        :attachment_size
        :message
      />
      <button
        v-if="data_source?.is_ai"
        @click="is_expanded = !is_expanded"
        class="flex-shrink-0 bg-slate-200 rounded-lg w-7 h-7 flex items-center justify-center"
      >
        <template v-if="!is_expanded">
          <ArrowRightIcon class="w-3 h-3 flex-shrink-0" />
          <span class="font-medium text-sm">A</span>
        </template>
        <ArrowDownIcon
          v-else
          class="w-3.5 h-3.5 rotate-180"
        />
      </button>
    </div>
    <div
      v-if="(data_source?.title || data_source?.content) && is_expanded"
      class="text-sm"
    >
      <div
        v-if="data_source?.title"
        class="font-semibold enter-line"
      >
        {{ data_source?.title }}
      </div>
      <!-- <div
        v-if="data_source?.content"
        @click="clickCopyPhoneEmail"
        v-html="fixXss(renderText(data_source?.content))"
        class="enter-line"
      /> -->

      <div
        class="enter-line"
        v-if="data_source?.content"
        @click="clickCopyPhoneEmail"
        v-html="fixXss($markdown.render(renderText(data_source?.content)))"
      />
        <!-- class="enter-line" -->

    </div>
    <Action
      v-if="data_source?.list_button?.length"
      :list_button="data_source?.list_button"
      :ai="data_source?.ai"
      :message_id="message?._id"
      :message
    />
  </div>
</template>
<script setup lang="ts">
import { clickCopyPhoneEmail, renderText } from '@/service/function'
import { MarkedService } from '@/utils/helper/Markdown'
import DOMPurify from 'dompurify'
import { container } from 'tsyringe'
import { ref, watch } from 'vue'

import Action from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Action.vue'
import Media from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Media.vue'

import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRight.vue'

import type {
  AttachmentSize,
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn đã được định dạng lại */
    data_source?: MessageTemplateInput
    /**có giữ kích thước không */
    is_fix_size?: boolean
    /**loại tin nhắn */
    message_type?: MessageInfo['message_type']
    /**kích thước của file đính kèm */
    attachment_size?: AttachmentSize
    /**dữ liệu của tin nhắn */
    message: MessageInfo
  }>(),
  {}
)

/** service render markdown */
const $markdown = container.resolve(MarkedService)

/**
 * có hiển thị content không
 * - nếu có cờ AI thì tự động không hiển thị
 * - nếu không có AI thì luôn hiển thị
 */
const is_expanded = ref(!$props.data_source?.is_ai)

// theo dõi khi có socket update tin nhắn hiện tại
watch(
  () => $props.data_source?.is_ai,
  is_ai => {
    // -> true: tức là tin nhắn mới được xử lý AI -> đóng content
    if (is_ai) is_expanded.value = false
  }
)

/**kiểm tra xem tin nhắn có đính kèm file không */
function isHaveFileAttachment() {
  return Boolean(
    $props.data_source?.image?.url ||
      $props.data_source?.video?.url ||
      $props.data_source?.audio?.url ||
      $props.data_source?.file?.url
  )
}
/**làm sạch html trước khi hiển thị, tránh XSS */
function fixXss(text?: string) {
  return DOMPurify.sanitize(text || '', {
    ADD_ATTR: ['target']
  })
}
</script>
