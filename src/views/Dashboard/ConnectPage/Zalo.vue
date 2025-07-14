<template>
  <div class="p-2 flex flex-col h-full">
    <div
      v-if="!connectPageStore.is_hidden_menu"
      class="w-fit flex rounded-lg p-1 bg-gray-100 text-gray-500 text-sm font-medium flex-shrink-0"
    >
      <button
        @click="zalo_type = 'ZALO_PERSONAL'"
        :class="{
          'shadow bg-white text-black': zalo_type === 'ZALO_PERSONAL',
        }"
        class="py-1 px-3 rounded"
      >
        {{ $t('Zalo Cá nhân') }}
        <span class="text-xxs bg-red-500 px-1 text-white py-1 rounded-full">
          Beta
        </span>
      </button>
      <button
        @click="zalo_type = 'ZALO_OA'"
        :class="{
          'shadow bg-white text-black': zalo_type === 'ZALO_OA',
        }"
        class="py-1 px-3 rounded"
      >
        {{ $t('Zalo Doanh nghiệp (OA)') }}
      </button>
    </div>
    <ZaloOA v-if="zalo_type === 'ZALO_OA'" />
    <ZaloPersonal
      v-else
      @done="$emit('done')"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConnectPageStore } from '@/stores'

import ZaloOA from '@/views/Dashboard/ConnectPage/ZaloOA.vue'
import ZaloPersonal from '@/views/Dashboard/ConnectPage/ZaloPersonal.vue'

const connectPageStore = useConnectPageStore()

/**loại zalo */
type IZaloType = 'ZALO_OA' | 'ZALO_PERSONAL'

const $emit = defineEmits(['done'])

/**Loại Zalo */
const zalo_type = ref<IZaloType>('ZALO_OA')

onMounted(() => {
  // xử lý thêm để tự động chọn loại zalo nếu cần thiết
  switch (connectPageStore.current_menu) {
    case 'ZALO_PERSONAL':
      zalo_type.value = 'ZALO_PERSONAL'
      break
  }
})
</script>
<style lang="scss" scoped></style>
