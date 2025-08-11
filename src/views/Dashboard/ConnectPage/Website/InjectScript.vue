<template>
  <Modal
    @close_modal="done"
    ref="inject_script_ref"
    class_body="py-2"
  >
    <template v-slot:header>
      {{ $t('v1.view.main.dashboard.select_platform.website.example.title') }}
    </template>
    <template v-slot:body>
      <div class="bg-white rounded-md flex flex-col gap-4 p-2">
        <div class="flex flex-col gap-2">
          <div class="text-sm text-slate-700">
            {{
              $t(
                'v1.view.main.dashboard.select_platform.website.example.guild_1'
              )
            }}
          </div>
          <pre
            @click="copyToClipboard(script_ref?.innerText || '')"
            ref="script_ref"
            v-tooltip.bottom="
              $t('v1.view.main.dashboard.select_platform.website.example.copy')
            "
            v-html="generateScript()"
            class="text-xs font-semibold bg-slate-100 rounded-md p-2 text-slate-700 cursor-copy"
          />
        </div>
        <div class="flex items-center justify-end">
          <Button
            @click="done"
            class="bg-slate-100 text-slate-500"
          >
            {{ $t('v1.common.close') }}
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { copyToClipboard } from '@/service/helper/copyWithAlert'

import Modal from '@/components/Modal.vue'
import Button from '@/views/Dashboard/ConnectPage/Button.vue'

import type { ComponentRef } from '@/service/interface/vue'

const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**id trang muốn lấy script */
    page_id?: string
  }>(),
  {}
)

/**ref của modal */
const inject_script_ref = ref<ComponentRef>()
/**ref của thẻ pre chứa mã nhúng */
const script_ref = ref<HTMLPreElement>()

/**tạo ra mã nhúng */
function generateScript() {
  return `&lt;script src="https://chatbox-embed-sdk.botbanhang.vn/dist/sdk.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
  BBH.init({ page_id: '${$props.page_id}' })
&lt;/script&gt;`
}
/**đóng mở modal */
function toggleModal() {
  // gọi vào hàm toggleModal của modal
  inject_script_ref.value.toggleModal()
}
/**kết thúc */
function done() {
  // gửi sự kiện done ra ngoài
  $emit('done')
}

// xuất hàm ra ngoài
defineExpose({ toggleModal })
</script>
