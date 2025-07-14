<template>
  <Alert
    ref="confirm_inactive_modal_ref"
    class_modal="w-[507px]"
    class_body="pt-4 text-sm"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.org_staff.remove.confirm') }}
    </template>
    <template #body>
      <div v-html="$t('v1.view.main.dashboard.org_staff.remove.guild_1', {
        member: selected_staff?.user_info?.full_name,
        org: orgStore.selected_org_info?.org_info?.org_name
      })" />
    </template>
    <template #footer>
      <button
        @click="confirm_inactive_modal_ref?.toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="inactiveStaff"
        class="btn-custom bg-red-100 text-red-500"
      >
        {{ $t('v1.common.delete') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useCommonStore, useOrgStore } from '@/stores'
import { kick_ms } from '@/service/api/chatbox/billing'
import { toastError } from '@/service/helper/alert'

import Alert from '@/components/Alert.vue'

import type { MemberShipInfo } from '@/service/interface/app/billing'

const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của trang được chọn */
    selected_staff?: MemberShipInfo
  }>(),
  {}
)

const orgStore = useOrgStore()
const commonStore = useCommonStore()

/**modal xác nhận huỷ trang */
const confirm_inactive_modal_ref = ref<InstanceType<typeof Alert>>()

/**ẩn hiện modal của component */
function toggleModal() {
  confirm_inactive_modal_ref.value?.toggleModal()
}
/**huỷ kích hoạt nhân viên này | ẩn nhân viên + đá ra khỏi tổ chức */
async function inactiveStaff() {
  /**id nhân viên */
  const STAFF_ID = $props.selected_staff?.staff_id

  // nếu không có id nhân viên thì thôi
  if (!STAFF_ID) return

  // nếu chưa chọn tổ chức thì thôi
  if (!orgStore.selected_org_id) return

  // * kích hoạt loading
  commonStore.is_loading_full_screen = true

  try {
    // tắt modal
    confirm_inactive_modal_ref.value?.toggleModal()

    // * call api đá nhân viên ra khỏi tổ chức
    await kick_ms(orgStore.selected_org_id, STAFF_ID)

    // giảm số nhân viên hiện tại của tổ chức
    if (orgStore.selected_org_info?.org_package?.org_current_staff)
      orgStore.selected_org_info.org_package.org_current_staff -= 1

    // thông báo thành công ra bên ngoài
    $emit('done')
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // tắt loading
  commonStore.is_loading_full_screen = false
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
