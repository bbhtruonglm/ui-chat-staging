<template>
  <CardItem>
    <template #icon>
      <AiBoldIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.app.title') }}
    </template>
    <template #item>
      <Toggle
        v-model="org_is_ai_auto_translate"
        class_toggle="peer-checked:bg-black"
      >
        {{ $t('v1.view.main.dashboard.org.app.auto_translate_en') }}
      </Toggle>
      <Toggle
        v-model="org_is_ai_auto_suggest_response"
        class_toggle="peer-checked:bg-black"
      >
        {{ $t('v1.view.main.dashboard.org.app.auto_hint_quick_answer') }}
      </Toggle>
      <Toggle
        v-model="org_is_ai_auto_alert_complain"
        class_toggle="peer-checked:bg-black"
      >
        {{ $t('v1.view.main.dashboard.org.app.auto_alert_complain') }}
      </Toggle>
      <Toggle
        v-model="org_is_ai_auto_auto_tag"
        class_toggle="peer-checked:bg-black"
      >
        {{ $t('v1.view.main.dashboard.org.app.auto_tag') }}
      </Toggle>
    </template>
  </CardItem>
  <!-- <CardItem>
    <template #icon>
      <SquaresPlusIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.app.widget') }}
    </template>
    <template #action>
      <button
        class="bg-blue-600 text-white py-1 px-4 rounded-md text-sm font-medium flex items-center gap-2"
      >
        {{ $t('v1.view.main.dashboard.nav.widget') }}
        <NewTabIcon class="w-4 h-4" />
      </button>
    </template>
    <template #item>
      <div class="grid grid-cols-4 gap-6">
        <ActorItem
          v-for="i of 4"
          class="cursor-pointer"
        >
          <template #avatar>
            <StaffAvatar
              :id="chatbotUserStore.chatbot_user?.fb_staff_id"
              class="w-8 h-8"
            />
          </template>
          <template #name> Ghi chú - Đặt lịch </template>
          <template #after-name>
            <div
              v-tooltip="$t('v1.view.main.dashboard.org.app.remove_widget')"
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
            <FacebookIcon class="w-3.5 h-3.5" />
            <ZaloIcon class="w-3.5 h-3.5" />
            <WebIcon class="w-3.5 h-3.5" />
          </template>
        </ActorItem>
      </div>
    </template>
  </CardItem> -->
</template>
<script setup lang="ts">
import { useChatbotUserStore, useOrgStore } from '@/stores'
import { computed } from 'vue'
import { set } from 'lodash'
import { useI18n } from 'vue-i18n'
import { initRequireData } from '@/views/Dashboard/Org/composable'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Toggle from '@/components/Toggle.vue'
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import AiBoldIcon from '@/components/Icons/AiBold.vue'
import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'
import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'
import MinusIcon from '@/components/Icons/Minus.vue'
import FacebookIcon from '@/components/Icons/Facebook.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import WebIcon from '@/components/Icons/Web.vue'
import NewTabIcon from '@/components/Icons/NewTab.vue'

const chatbotUserStore = useChatbotUserStore()
const orgStore = useOrgStore()
const { t: $t } = useI18n()

const { updateOrg } = initRequireData()

/**AI tự động dịch */
const org_is_ai_auto_translate = computed({
  get() {
    return orgStore.selected_org_info?.org_config?.org_is_ai_auto_translate
  },
  set(val) {
    set(orgStore, 'selected_org_info.org_config.org_is_ai_auto_translate', val)

    // cập nhật lên server
    updateOrg()
  },
})
/**AI tự động tạo câu trả lời */
const org_is_ai_auto_suggest_response = computed({
  get() {
    return orgStore.selected_org_info?.org_config
      ?.org_is_ai_auto_suggest_response
  },
  set(val) {
    set(
      orgStore,
      'selected_org_info.org_config.org_is_ai_auto_suggest_response',
      val
    )

    // cập nhật lên server
    updateOrg()
  },
})
/**AI tự động cảnh báo khách phàn nàn */
const org_is_ai_auto_alert_complain = computed({
  get() {
    return orgStore.selected_org_info?.org_config?.org_is_ai_auto_alert_complain
  },
  set(val) {
    set(
      orgStore,
      'selected_org_info.org_config.org_is_ai_auto_alert_complain',
      val
    )

    // cập nhật lên server
    updateOrg()
  },
})
/**AI tự động gắn nhãn */
const org_is_ai_auto_auto_tag = computed({
  get() {
    return orgStore.selected_org_info?.org_config?.org_is_ai_auto_auto_tag
  },
  set(val) {
    set(orgStore, 'selected_org_info.org_config.org_is_ai_auto_auto_tag', val)

    // cập nhật lên server
    updateOrg()
  },
})
</script>
