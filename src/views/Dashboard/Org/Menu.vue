<template>
  <template v-for="menu of LIST_MENU">
  <MenuItem
    v-if="menu.path !== 'pay' || IS_SHOW_PAYMENT"
    @click="$router.push(genOrgPath(menu.path))"
    :icon="menu.icon"
    :title="menu.title"
    :is_selected="$route.path.includes(genOrgPath(menu.path))"
    class_icon="w-5 h-5"
  />
  </template>
</template>
<script setup lang="ts">
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'

import CogIcon from '@/components/Icons/Cog.vue'
import CardIcon from '@/components/Icons/Card.vue'
import AiBoldIcon from '@/components/Icons/AiBold.vue'
import CodeIcon from '@/components/Icons/Code.vue'
import RetionAgentIcon from '@/components/Icons/RetionAgent.vue'
import { ServerStackIcon } from '@heroicons/vue/24/solid'

const { t: $t } = useI18n()

const IS_SHOW_PAYMENT = $env.is_show_payment

/**danh sách các menu */
const LIST_MENU = [
  {
    title: $t('v1.common.setting'),
    icon: markRaw(CogIcon),
    path: 'setting',
  },
  {
    title: $t('v1.view.main.dashboard.org.menu.pay'),
    icon: markRaw(CardIcon),
    path: 'pay',
  },
  {
    title: $t('Trợ lý ảo'),
    icon: markRaw(RetionAgentIcon),
    path: 'virtual-assistant',
  },
  {
    title: $t('Webhook'),
    icon: markRaw(ServerStackIcon),
    path: 'webhook',
  },
  // {
  //   title: $t('v1.view.main.dashboard.org.menu.app'),
  //   icon: markRaw(AiBoldIcon),
  //   path: 'app',
  // },
  // {
  //   title: $t('v1.view.main.dashboard.org.menu.api'),
  //   icon: markRaw(CodeIcon),
  //   path: 'api',
  // },
]

/**tạo ra đường dẫn của org */
function genOrgPath(path: string) {
  return `/dashboard/org/${path}`
}
</script>
