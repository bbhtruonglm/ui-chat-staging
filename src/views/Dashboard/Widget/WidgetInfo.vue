<template>
  <Modal
    ref="widget_info_ref"
    class_modal="w-[881px] h-[630px]"
    class_body="flex gap-2 bg-white rounded-md p-2 flex flex-col relative my-2"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.widget.info.title') }}
    </template>
    <template #body>
      <div class="flex-shrink-0 flex items-center gap-2.5 pb-2 px-2">
        <WidgetAvatar
          :src="widgetStore.selected_widget?.icon"
          class="w-9 h-9 rounded-oval"
        />
        <div>
          <div class="font-semibold">
            {{ widgetStore.selected_widget?.name }}
          </div>
          <div class="text-xs">
            {{ $t('v1.view.main.dashboard.widget.info.develop_by') }}
            {{ widgetStore.selected_widget?.partner_name }}
          </div>
        </div>
      </div>
      <div class="flex-shrink-0 text-sm font-medium px-2 py-1 border-b">
        {{ $t('v1.view.main.dashboard.widget.info.description') }}
      </div>
      <div class="text-sm flex-grow p-2 enter-line min-h-0 overflow-y-auto">
        {{ widgetStore.selected_widget?.description }}
      </div>
      <div class="flex-shrink-0 flex justify-end py-2 px-4 border-t">
        <button
          @click="install_widget_ref?.toggleModal()"
          class="py-2 px-4 rounded-md bg-blue-700 text-white hover:brightness-90"
        >
          {{ $t('v1.common.setting') }}
        </button>
      </div>
    </template>
  </Modal>
  <InstallWidget ref="install_widget_ref" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWidgetStore } from '@/stores'

import Modal from '@/components/Modal.vue'
import WidgetAvatar from '@/views/Dashboard/Widget/WidgetAvatar.vue'
import InstallWidget from '@/views/Dashboard/Widget/WidgetInfo/InstallWidget.vue'

const $t = useI18n().t
const widgetStore = useWidgetStore()

/**modal thông tin widget */
const widget_info_ref = ref<InstanceType<typeof Modal>>()
/**modal cài đặt widget */
const install_widget_ref = ref<InstanceType<typeof InstallWidget>>()

/**mở modal */
function toggleModal() {
  widget_info_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>
