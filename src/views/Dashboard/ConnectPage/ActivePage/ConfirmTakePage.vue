<template>
  <Alert
    ref="alert_over_quota_ref"
    class_modal="w-[507px]"
    class_body="text-sm py-3"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.org_page.take_page.title') }}
    </template>
    <template #body>
      <div>
        {{ $t('v1.view.main.dashboard.org_page.take_page.guild_1') }}
      </div>
      <ul class="list-disc list-inside">
        <li class="pl-3">
          <b>{{ $t('v1.view.main.dashboard.org_page.take_page.page') }}</b>
          "{{ another_pages_name?.join(', ') }}"
          {{ $t('v1.view.main.dashboard.org_page.take_page.guild_2') }}
        </li>
        <li class="pl-3">
          <b>{{ $t('v1.view.main.dashboard.org_page.take_page.action') }}</b>
          {{ $t('v1.view.main.dashboard.org_page.take_page.guild_3') }}
        </li>
        <li class="pl-3">
          <b>{{ $t('v1.view.main.dashboard.org_page.take_page.result') }}</b>
          <ul class="list-disc list-inside">
            <li class="pl-3">
              {{ $t('v1.view.main.dashboard.org_page.take_page.guild_4') }}
            </li>
            <li class="pl-3">
              {{ $t('v1.view.main.dashboard.org_page.take_page.guild_5') }}
            </li>
          </ul>
        </li>
      </ul>
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
        class="btn-custom bg-blue-700 text-white"
      >
        {{ $t('v1.common.ok') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Alert from '@/components/Alert.vue'

const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**tên của các trang khác tổ chức của mình */
    another_pages_name?: string[]
  }>(),
  {}
)

/**modal xác nhận huỷ trang */
const alert_over_quota_ref = ref<InstanceType<typeof Alert>>()

/**ẩn hiện modal của component */
function toggleModal() {
  alert_over_quota_ref.value?.toggleModal()
}
/**xác nhận chuyển trang */
function done() {
  // ẩn modal
  toggleModal()

  // thông báo đồng ý chuyển trang
  $emit('done')
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
