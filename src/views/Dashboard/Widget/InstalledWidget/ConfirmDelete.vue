<template>
  <Alert
    ref="alert_ref"
    class_modal="w-[458px]"
    class_body="py-3 flex flex-col gap-2.5"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.widget.installed.delete_warning') }}
    </template>
    <template v-slot:body>
      <div
        v-html="
          $t('v1.view.main.dashboard.widget.installed.delete_description', {
            app: widget_name,
            page: page_name,
          })
        "
      />
    </template>
    <template v-slot:footer>
      <button
        @click="toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="done"
        class="btn-custom text-red-600 bg-red-100"
      >
        {{ $t('v1.common.delete') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Alert from '@/components/Alert.vue'

import type { ComponentRef } from '@/service/interface/vue'

const $emit = defineEmits(['done'])

const $t = useI18n().t

/**ref của modal */
const alert_ref = ref<ComponentRef>()
/**id của widget */
const widget_id = ref<string>()
/**tên của trang */
const page_name = ref<string>()
/**tên của widget */
const widget_name = ref<string>()

/**mở modal */
function toggleModal(id?: string, name?: string, page?: string) {
  // lưu lại id của widget
  widget_id.value = id
  // lưu lại tên của trang
  page_name.value = page
  // lưu lại tên của widget
  widget_name.value = name

  // mở modal
  alert_ref.value.toggleModal()
}
/**xác nhận xóa */
function done() {
  // gửi event done
  $emit('done', widget_id.value)

  // đóng modal
  toggleModal()
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
