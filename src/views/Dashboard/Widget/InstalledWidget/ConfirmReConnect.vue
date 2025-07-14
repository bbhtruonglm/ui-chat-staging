<template>
  <Alert
    ref="alert_ref"
    class_modal="w-[458px]"
    class_body="py-3 flex flex-col gap-2.5"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.widget.installed.link_warning') }}
    </template>
    <template v-slot:body>
      <div
        v-html="$t('v1.view.main.dashboard.widget.installed.link_description')"
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
        class="btn-custom text-white bg-blue-600"
      >
        {{ $t('v1.view.main.dashboard.widget.installed.re_connect') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Alert from '@/components/Alert.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { AppInstalledInfo } from '@/service/interface/app/widget'

const $emit = defineEmits(['done'])

const $t = useI18n().t

/**ref của modal */
const alert_ref = ref<ComponentRef>()
/**id của widget */
const widget = ref<AppInstalledInfo>()

/**mở modal */
function toggleModal(_widget?: AppInstalledInfo) {
  // lưu lại id của widget
  widget.value = _widget

  // mở modal
  alert_ref.value.toggleModal()
}
/**xác nhận xóa */
function done() {
  // gửi event done
  $emit('done', widget.value)

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
