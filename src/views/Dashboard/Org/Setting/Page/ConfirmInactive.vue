<template>
  <Alert
    ref="confirm_inactive_modal_ref"
    class_modal="w-[507px]"
    class_body="text-zinc-500"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{
        $t('v1.view.main.dashboard.org.setting.inactive_page.title', {
          name: selected_page?.name,
        })
      }}
    </template>
    <template #body>
      <div>
        {{ $t('v1.view.main.dashboard.org.setting.inactive_page.explain') }}
      </div>
      <div
        v-html="
          $t('v1.view.main.dashboard.org.setting.inactive_page.active_guild')
        "
      />
    </template>
    <template #footer>
      <button
        @click="confirm_inactive_modal_ref?.toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="inactivePage"
        class="btn-custom bg-red-100 text-red-500"
      >
        {{ $t('v1.common.ok') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { usePageStore, useCommonStore, useOrgStore } from '@/stores'
import { kick_os } from '@/service/api/chatbox/billing'
import { update_page_sync } from '@/service/api/chatbox/n4-service'
import { toastError } from '@/service/helper/alert'

import Alert from '@/components/Alert.vue'

import type { IPage, PageInfo } from '@/service/interface/app/page'
const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của trang được chọn */
    selected_page?: IPage
  }>(),
  {}
)

const orgStore = useOrgStore()
const pageStore = usePageStore()
const commonStore = useCommonStore()

/**modal xác nhận huỷ trang */
const confirm_inactive_modal_ref = ref<InstanceType<typeof Alert>>()

/**ẩn hiện modal của component */
function toggleModal() {
  confirm_inactive_modal_ref.value?.toggleModal()
}
/**huỷ kích hoạt page này | ẩn page + đá ra khỏi tổ chức */
async function inactivePage() {
  /**id trang */
  const PAGE_ID = $props.selected_page?.fb_page_id

  // nếu không có id trang thì thôi
  if (!PAGE_ID) return

  // nếu chưa chọn tổ chức thì thôi
  if (!orgStore.selected_org_id) return

  // * kích hoạt loading
  commonStore.is_loading_full_screen = true

  try {
    // tắt modal
    confirm_inactive_modal_ref.value?.toggleModal()

    // call api huỷ kích hoạt trang
    // api này có thể call lỗi, vì không khớp được id user mới với id cũ
    try {
      await update_page_sync({ page_id: PAGE_ID, is_active: false })  
    } catch (e) {}

    // call api đá trang ra khỏi tổ chức
    await kick_os(orgStore.selected_org_id, PAGE_ID)

    // xoá dữ liệu trang khỏi danh sách dữ liệu trang đang chọn (nếu có)
    delete pageStore.active_page_list[PAGE_ID]

    // xoá id trang khỏi danh sách id trang được chọn (nếu có)
    delete pageStore.selected_page_id_list[PAGE_ID]
  
    // giảm số trang hiện tại của tổ chức
    if (orgStore.selected_org_info?.org_package?.org_current_page)
    orgStore.selected_org_info.org_package.org_current_page -= 1

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
