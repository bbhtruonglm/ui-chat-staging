<template>
  <CardItem>
    <template #icon>
      <WalletIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.pay.account') }}
    </template>
    <template #action>
      <span class="text-sm font-medium">
        {{ $t('v1.view.main.dashboard.org.pay.balance') }}
      </span>
    </template>
    <template #item>
      <div class="flex justify-between">
        <div class="text-xl font-semibold">
          {{ orgStore.selected_org_info?.org_info?.org_name }}
        </div>
        <div class="text-2xl font-bold">
          {{ currency(Math.ceil(wallet_info?.estimate_balance || 0)) || 0 }}
        </div>
      </div>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { currency } from '@/service/helper/format'
import { useOrgStore } from '@/stores'
import { onMounted, ref, watch } from 'vue'
import { read_wallet } from '@/service/api/chatbox/billing'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'

import WalletIcon from '@/components/Icons/Wallet.vue'

import type { ICustomWallet } from '@/service/interface/app/billing'
import { toastError } from '@/service/helper/alert'

const orgStore = useOrgStore()

/** Thông tin ví */
const wallet_info = ref<ICustomWallet>()

// đọc dữ liệu ví khi component được tạo
onMounted(readWallet)
// đọc dữ liệu ví khi tổ chức được chọn
watch(() => orgStore.selected_org_id, readWallet)

/**đọc dữ liệu ví */
async function readWallet() {
  // nếu chưa chọn tổ chức nào thì không làm gì cả
  if (!orgStore.selected_org_id) return

  // kích hoạt chế độ loading
  orgStore.is_loading = true

  try {
    // đọc dữ liệu ví
    wallet_info.value = await read_wallet(orgStore.selected_org_id)
  } catch (e) {
    // hiển thị thông báo lỗi
    toastError(e)
  }

  // tắt chế độ loading
  orgStore.is_loading = false
}
</script>
