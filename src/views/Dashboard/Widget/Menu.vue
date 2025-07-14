<template>
  <MenuItem
    v-for="menu of LIST_MENU"
    @click="$router.push(genOrgPath(menu.path))"
    :icon="menu.icon"
    :title="menu.title"
    :is_selected="$route.path.includes(genOrgPath(menu.path))"
    class_icon="w-5 h-5"
  />
</template>
<script setup lang="ts">
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'

import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'
import WrenchSettingIcon from '@/components/Icons/WrenchSetting.vue'

import { CodeBracketIcon } from '@heroicons/vue/24/solid'

const { t: $t } = useI18n()

/**danh sách các menu */
const LIST_MENU = [
  {
    title: $t('v1.view.main.dashboard.widget.tab.market'),
    icon: markRaw(SquaresPlusIcon),
    path: 'market',
  },
  {
    title: $t('v1.view.main.dashboard.widget.tab.installed'),
    icon: markRaw(WrenchSettingIcon),
    path: 'installed',
  },
  {
    title: $t('v1.view.main.dashboard.widget.tab.my_app'),
    icon: markRaw(CodeBracketIcon),
    path: 'my-widget',
  },
]

/**tạo ra đường dẫn của widget */
function genOrgPath(path: string) {
  return `/dashboard/widget/${path}`
}
</script>
