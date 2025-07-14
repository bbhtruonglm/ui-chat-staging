<template>
  <div
    @click.stop="confirm_inactive_modal_ref?.toggleModal()"
    v-tooltip="$t('v1.view.main.dashboard.select_page.cancel_page')"
    class="group/minus hidden group-hover:flex"
  >
    <MinusOutlineIcon class="w-4 h-4 text-slate-500 group-hover/minus:hidden" />
    <MinusIcon class="w-4 h-4 text-slate-900 hidden group-hover/minus:block" />
  </div>
  <!-- <Alert
    ref="confirm_unactive_modal_ref"
    class_modal="w-[507px]"
    class_body="text-zinc-500"
    class_footer="flex justify-between items-center"
  >
    <template #header>
      {{
        $t('v1.view.main.dashboard.select_page.hide_page.title', {
          name: page_name,
        })
      }}
    </template>
    <template #body>
      <div>
        {{ $t('v1.view.main.dashboard.select_page.hide_page.explain') }}
      </div>
      <div
        v-html="$t('v1.view.main.dashboard.select_page.hide_page.active_guild')"
      />
    </template>
    <template #footer>
      <button
        @click="confirm_unactive_modal_ref?.toggleModal()"
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
  </Alert> -->
  <ConfirmInactive
    @done="doneInactivePage"
    :selected_page
    ref="confirm_inactive_modal_ref"
  />
</template>
<script setup lang="ts">
import { useCommonStore, usePageStore } from '@/stores'
import { usePageManager } from '@/views/Dashboard/composables/usePageManager'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Alert from '@/components/Alert.vue'
import ConfirmInactive from '@/views/Dashboard/Org/Setting/Page/ConfirmInactive.vue'

import MinusIcon from '@/components/Icons/Minus.vue'
import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'

import type { IPage } from '@/service/interface/app/page'

const $props = withDefaults(
  defineProps<{
    /**id trang */
    page_id?: string
    /**tên trang */
    page_name?: string
    /**dữ liệu của trang được chọn */
    selected_page?: IPage
  }>(),
  {}
)

const { t: $t } = useI18n()
const pageStore = usePageStore()
const commonStore = useCommonStore()

/** composable */
const { sortListPage } = usePageManager()

/**modal xác nhận huỷ trang */
const confirm_unactive_modal_ref = ref<InstanceType<typeof Alert>>()
/**modal xác nhận huỷ trang */
const confirm_inactive_modal_ref = ref<InstanceType<typeof ConfirmInactive>>()

/**hoàn thành việc huỷ kích hoạt trang */
async function doneInactivePage() {
  // xoá dữ liệu trang khỏi danh sách dữ liệu trang đang chọn
  delete pageStore.active_page_list[$props.page_id!]

  // xoá id trang khỏi danh sách id trang được chọn
  delete pageStore.selected_page_id_list[$props.page_id!]

  // sort lại danh sách trang
  sortListPage()
}
// /**huỷ kích hoạt page này | ẩn page */
// function inactivePage() {
//   // tắt modal
//   confirm_unactive_modal_ref.value?.toggleModal()

//   // nếu không có id trang thì thôi
//   if (!$props.page_id) return

//   flow(
//     [
//       // * kích hoạt loading
//       (cb: CbError) => {
//         commonStore.is_loading_full_screen = true

//         cb()
//       },
//       // * call api update page
//       (cb: CbError) =>
//         update_page({ page_id: $props.page_id, is_active: false }, (e, r) => {
//           if (e) return cb(e)

//           cb()
//         }),
//       // * xoá page bị ẩn khỏi danh sách page và danh sách page đang chọn (nếu có)
//       (cb: CbError) => {
//         // xoá dữ liệu trang khỏi danh sách dữ liệu trang đang chọn
//         delete pageStore.active_page_list[$props.page_id!]

//         // xoá id trang khỏi danh sách id trang được chọn
//         delete pageStore.selected_page_id_list[$props.page_id!]

//         // sort lại danh sách trang
//         sortListPage()

//         cb()
//       },
//     ],
//     e => {
//       // tắt loading
//       commonStore.is_loading_full_screen = false
//     }
//   )
// }
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
