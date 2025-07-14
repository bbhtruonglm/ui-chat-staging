<template>
  <div
    class="flex items-center gap-1 flex-grow min-w-0 overflow-hidden overflow-x-auto"
  >
    <div
      v-for="group of access_groups"
      class="py-1 px-3 rounded bg-white text-xs font-normal"
    >
      {{ group?.group_name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useChatbotUserStore, useOrgStore } from '@/stores'
import { BillingAppGroup } from '@/utils/api/Billing'
import { computed, onMounted, ref, watch } from 'vue'

const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()

/**danh sách nhóm của tổ chức này */
const groups = ref<IGroup[]>()

class Main {
  /**đọc danh sách nhóm */
  async readGroup(): Promise<void> {
    // đọc toàn bộ nhóm từ server
    groups.value = await new BillingAppGroup().readGroup()
  }
}
const $main = new Main()

// lấy danh sách nhóm khi thành phần được khởi tạo
onMounted(() => $main.readGroup())

watch(
  () => orgStore.selected_org_id,
  () => $main.readGroup()
)

/**id người dùng hiện tại */
const user_id = computed(() => chatbotUserStore.chatbot_user?.user_id)

/**các nhóm người dùng hiện tại được phép truy cập */
const access_groups = computed(() => {
  return groups.value?.filter(group =>
    group?.group_staffs?.includes(user_id.value || '')
  )
})
</script>
