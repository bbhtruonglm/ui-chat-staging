<template>
  <Alert
    ref="not_enough_money_ref"
    class_modal="w-[507px]"
    class_body="text-sm py-4"
    class_footer="flex justify-between items-center mt-4"
  >
    <template #header>
      {{
        $t('v1.view.main.dashboard.org.pay.inc_quota.not_enough_money.title')
      }}
    </template>
    <template #body>
      {{
        $t(
          'v1.view.main.dashboard.org.pay.inc_quota.not_enough_money.description'
        )
      }}
    </template>
    <template #footer>
      <button
        @click="not_enough_money_ref?.toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="$router.push('/dashboard/org/pay/recharge')"
        class="btn-custom text-white bg-blue-600"
      >
        {{ $t('v1.view.main.dashboard.org.recharge') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Alert from '@/components/Alert.vue'

/**ref của modal kết nối nền tảng */
const not_enough_money_ref = ref<InstanceType<typeof Alert>>()

/**ẩn hiện modal của component */
function toggleModal() {
  not_enough_money_ref.value?.toggleModal()
}

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
