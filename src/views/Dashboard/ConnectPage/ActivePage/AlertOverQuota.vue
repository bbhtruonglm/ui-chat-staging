<template>
  <Alert
    ref="alert_over_quota_ref"
    class_modal="w-[507px]"
    class_body="text-zinc-500"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.org_page.over_quota.title') }}
    </template>
    <template #body>
      {{ $t('v1.view.main.dashboard.org_page.over_quota.description') }}
    </template>
    <template #footer>
      <button
        @click="toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="done"
        class="btn-custom bg-blue-100 text-blue-500"
      >
        {{ $t('v1.view.main.dashboard.org_page.over_quota.view') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Alert from '@/components/Alert.vue'

const $emit = defineEmits(['done'])

const $router = useRouter()

/**modal xác nhận huỷ trang */
const alert_over_quota_ref = ref<InstanceType<typeof Alert>>()

/**ẩn hiện modal của component */
function toggleModal() {
  alert_over_quota_ref.value?.toggleModal()
}
/**click vào nút đồng ý */
function done() {
  // báo cho component cha biết đã xong
  $emit('done')

  // ẩn modal
  toggleModal()

  // chuyển sang trang thông tin gói cước
  $router.push('/dashboard/org/pay/info')
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
