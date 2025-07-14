<template>
  <div
    v-if="isVisible()"
    class="flex items-start text-sm"
  >
    <div class="w-28 font-semibold ml-5 flex-shrink-0 truncate">
      {{ title }}
    </div>
    <div class="flex flex-col gap-2.5">
      <template v-for="item of source">
        <div
          v-if="item.contact_type === type"
          class="group"
        >
          <div v-if="!conversationStore.is_edit_info">
            {{ item.contact_value }}
          </div>
          <div
            v-else
            class="flex items-center gap-1"
          >
            <input
              v-model="item.contact_value"
              @input="
                conversationStore.is_edit_client.contact_update[item._id!] = 1
              "
              :placeholder
              class="py-2 px-3 rounded-md border focus:outline-none w-80"
            />
            <BinIcon
              @click="removeContact(item._id!)"
              class="text-slate-500 w-5 h-5 cursor-pointer hidden group-hover:block"
            />
          </div>
        </div>
      </template>
      <div
        v-if="conversationStore.is_edit_info"
        @click="addContact"
        class="text-sm font-medium text-slate-500 cursor-pointer"
      >
        + {{ create_title }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { remove } from 'lodash'
import { confirmSync } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'

import BinIcon from '@/components/Icons/Bin.vue'

import type { ContactInfo } from '@/utils/api/Ai'

const conversationStore = useConversationStore()
const { t: $t } = useI18n()

const $props = withDefaults(
  defineProps<{
    source?: ContactInfo[]
    /**tiêu đề */
    title?: string
    /**hướng dẫn */
    placeholder?: string
    /**tiêu đề cho nút tạo */
    create_title: string
    /**kiểu liên hệ */
    type: ContactInfo['contact_type']
  }>(),
  {}
)

/**thêm liên hệ */
function addContact() {
  /**id tạm của liên hệ này */
  const TEMP_ID = Date.now().toString()

  // thêm liên hệ vào danh sách liên hệ
  $props.source?.push({
    _id: TEMP_ID,
    contact_type: $props.type,
    contact_value: '',
  })

  // lưu lại id tạm vào danh sách liên hệ cần tạo
  conversationStore.is_edit_client.contact_create[TEMP_ID] = 1
}
/**xoá liên hệ */
async function removeContact(id: string) {
  // cảnh báo trước khi xoá
  if (
    !(await confirmSync(
      'warning',
      $t('v1.view.main.dashboard.chat.client.confirm_remove_contact')
    ))
  )
    return

  // xoá khỏi giao diện
  remove($props.source || [], contact => contact?._id === id)

  // thêm vào danh sách liên hệ cần xoá
  conversationStore.is_edit_client.contact_remove[id] = 1
}
/**có hiển thị list không */
function isVisible(): boolean {
  // luôn hiển thị khi ở chế độ chỉnh sửa
  if (conversationStore.is_edit_info) return true

  // không hiển thị nếu không có dữ liệu
  return !!$props.source?.filter(item => item.contact_type === $props.type)
    .length
}
</script>
