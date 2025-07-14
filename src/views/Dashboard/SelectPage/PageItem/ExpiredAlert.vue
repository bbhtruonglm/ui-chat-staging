<template>
  <Alert
    ref="expired_alert_modal_ref"
    class_modal="w-[507px]"
    class_body="py-3"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.select_page.expire.alert.title') }}
    </template>
    <template #body>
      <div
        v-html="
          $t('v1.view.main.dashboard.select_page.expire.alert.description')
        "
      />
    </template>
    <template #footer>
      <button
        @click="expired_alert_modal_ref?.toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="$router.push('/dashboard/pricing')"
        class="btn-custom bg-blue-100 text-blue-500"
      >
        {{ $t('v1.view.main.dashboard.select_page.expire.alert.upgrade') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

import Alert from '@/components/Alert.vue'

const { t: $t } = useI18n()

/**modal cảnh báo trang đã hết hạn */
const expired_alert_modal_ref = ref<InstanceType<typeof Alert>>()

/**toggle modal cảnh báo trang đã hết hạn */
function toggleModal() {
  expired_alert_modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
