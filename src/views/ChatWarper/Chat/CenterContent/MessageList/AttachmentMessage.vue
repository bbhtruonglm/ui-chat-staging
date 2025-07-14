<template>
  <div
    :class="{ 'justify-end': type === 'PAGE' }"
    class="p-2 bg-white rounded-lg flex flex-col gap-2"
  >
    <div class="flex gap-2 justify-between">
      <div class="flex flex-wrap relative z-1 gap-2">
        <template v-for="(attachment, index) of message?.message_attachments">
          <div
            @click="$main.viewAttachment(index)"
            class="cursor-pointer hover:brightness-90 rounded-lg bg-gray-50 overflow-hidden"
            :style="
              $main.initSize(
                message?.attachment_size?.[index]?.width,
                message?.attachment_size?.[index]?.height
              )
            "
          >
            <img
              :src="
                $cdn.fbMessageMedia(
                  $props.message?.fb_page_id,
                  message?.message_mid,
                  index
                )
              "
              class="object-contain w-full h-full alo"
            />
          </div>
        </template>
      </div>
    </div>
    <MediaDetail
      ref="media_detail_ref"
      :data_source
      :message_id="message?._id"
      :message
      :index="selected_item_index"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import MediaDetail from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MediaDetail.vue'

import type {
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'
import { FitSize } from '@/utils/helper/Attachment'
import { SingletonCdn } from '@/utils/helper/Cdn'
import { CreateDataSource, type ICreateDataSource } from './CreateDataSource'
import { container } from 'tsyringe'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của tin nhắn */
    message: MessageInfo
    /**được gửi từ đâu */
    type: 'CLIENT' | 'PAGE'
    /**có phải là tin nhắn trả lời không */
    is_reply?: boolean
  }>(),
  {}
)

const $cdn = SingletonCdn.getInst()

/**ref của component MediaDetail */
const media_detail_ref = ref<InstanceType<typeof MediaDetail>>()
/**dữ liệu của tin nhắn đã được format sang dạng mới */
const data_source = ref<MessageTemplateInput>({})
/**index của phần tử được chọn */
const selected_item_index = ref<number>()

class Main {
  /**
   * @param SERVICE_CREATE_DATA_SOURCE dịch vụ tạo dữ liệu file
   */
  constructor(
    private readonly SERVICE_CREATE_DATA_SOURCE: ICreateDataSource = container.resolve(
      CreateDataSource
    )
  ) {}

  /**xem chi tiết file này */
  viewAttachment(index: number = 0) {
    // lưu lại vị trí của phần tử được chọn
    selected_item_index.value = index

    // tạm thời xử lý data để hiện CTA
    data_source.value = this.SERVICE_CREATE_DATA_SOURCE.exec(
      $props.message,
      index
    )

    // mở modal
    media_detail_ref.value?.toggleModal()
  }
  /**tạo ra kích thước cho phần từ trước khi hình ảnh, video được load */
  initSize(width?: number, height?: number) {
    // tính toán
    return new FitSize(368, 80, width, height).toCss()
  }
}
const $main = new Main()
</script>
