<template>
  <Transition
    enter-active-class="transition ease-in-out duration-500"
    leave-active-class="transition ease-in-out duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="selectPageStore.is_group_page_mode"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-xl bg-slate-900 py-2 px-5 flex gap-6 text-sm font-medium z-10"
    >
      <button
        @click="backSinglePageMode"
        class="btn-custom bg-slate-100 text-slate-900"
      >
        <CloseBoldIcon class="w-3.5 h-3.5" />
        {{ $t('v1.view.main.dashboard.select_page.chat_one_page') }}
      </button>
      <button
        @click="chatManyPage"
        :class="{
          'contrast-50 cursor-not-allowed': !pageStore.countSelectedPage(),
        }"
        class="btn-custom text-white bg-orange-600"
      >
        <SquaresPlusIcon class="w-3.5 h-3.5" />
        {{ $t('v1.view.main.dashboard.select_page.munti_chat_page') }}
      </button>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { usePageStore, useSelectPageStore } from '@/stores'
import { usePageManager } from '@/views/Dashboard/composables/usePageManager'

import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'
import CloseBoldIcon from '@/components/Icons/CloseBold.vue'

const selectPageStore = useSelectPageStore()
const pageStore = usePageStore()

/** composable */
const { goToChat } = usePageManager()

/**chuyển vào trang chat */
function chatManyPage() {
  // nếu không có page nào được chọn thì bỏ qua
  if (!pageStore.countSelectedPage()) return

  // chuyển vào trang chat
  goToChat()
}
/**chuyển về chế độ chọn 1 trang */
function backSinglePageMode() {
  // chuyển về chế độ chọn 1 trang
  selectPageStore.toggleGroupPageMode()

  // reset lại danh sách trang đã chọn
  pageStore.selected_page_id_list = {}
}
</script>
<style scoped lang="scss">
.btn-custom {
  @apply rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
