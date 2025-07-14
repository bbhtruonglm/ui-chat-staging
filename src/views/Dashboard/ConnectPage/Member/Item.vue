<template>
  <ActorItem
    :class="{
      'opacity-50': !staff?.ms_is_active,
    }"
    class="cursor-pointer"
  >
    <template #avatar>
      <StaffAvatar
        :id="staff?.user_info?.user_id"
        class="w-8 h-8 rounded-oval"
      />
    </template>
    <template #name>
      {{ staff?.user_info?.full_name }}
    </template>
    <template #after-name>
      <div
        @click="confirm_inactive_modal_ref?.toggleModal()"
        v-if="isAllowRemoveMember(staff)"
        v-tooltip="$t('v1.view.main.dashboard.org_staff.remove.title')"
        class="group/minus hidden group-hover:flex"
      >
        <MinusOutlineIcon
          class="w-4 h-4 text-slate-500 group-hover/minus:hidden"
        />
        <MinusIcon
          class="w-4 h-4 text-slate-900 hidden group-hover/minus:block"
        />
      </div>
    </template>
    <template #description>
      <div
        @click="$clipboard.copy(staff?.staff_id)"
        class="text-xs text-slate-500 flex-grow truncate min-w-0 cursor-copy"
      >
        {{ staff?.staff_id }}
      </div>
    </template>
  </ActorItem>
  <ConfirmInactive
    @done="$emit('done')"
    :selected_staff="staff"
    ref="confirm_inactive_modal_ref"
  />
</template>
<script setup lang="ts">
import { useOrgStore, useChatbotUserStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Clipboard } from '@/utils/helper/Clipboard'
import { container } from 'tsyringe'

import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'
import ConfirmInactive from '@/views/Dashboard/Org/Setting/Staff/ConfirmInactive.vue'

import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'
import MinusIcon from '@/components/Icons/Minus.vue'

import type { MemberShipInfo } from '@/service/interface/app/billing'

const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**dữ liệu thành viên */
    staff: MemberShipInfo
  }>(),
  {}
)

const $clipboard = container.resolve(Clipboard)
const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()
const { t: $t } = useI18n()

/**modal xác nhận huỷ trang */
const confirm_inactive_modal_ref = ref<InstanceType<typeof ConfirmInactive>>()

/**có quyền xoá nhân viên không */
function isAllowRemoveMember(staff: MemberShipInfo) {
  return (
    // phải là admin tổ chức
    orgStore.isAdminOrg() &&
    // không phải là chính mình
    chatbotUserStore.chatbot_user?.user_id !== staff?.staff_id
  )
}
</script>
