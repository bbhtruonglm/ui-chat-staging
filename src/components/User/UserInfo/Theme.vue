<template>
  <select
    v-model="current_theme"
    @change="changeTheme"
    class="py-2 pr-0 rounded-md focus:outline-none border px-3 text-sm cursor-pointer"
  >
    <option
      v-for="(title, key) of SELECT_THEME"
      :value="key"
    >
      {{ title }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

/**chọn theme */
const SELECT_THEME: Record<string, string> = {
  // theme sáng
  light: $t('v1.view.main.dashboard.user.light'),
  // theme tối
  dark: $t('v1.view.main.dashboard.user.dark'),
  // theme tự động
  auto: $t('v1.view.main.dashboard.user.auto'),
}

/**theme hiện tại đang chọn */
const current_theme = computed(() => localStorage.getItem('theme') || 'auto')

/**lưu lại theme mới vào local, và reload lại trang */
function changeTheme($event: Event) {
  const { value: THEME } = $event.target as HTMLSelectElement

  // lưu lại ngôn ngữ mới vào local
  localStorage.setItem('theme', THEME)

  // reload lại trang
  window.location.reload()
}
</script>
