<template>
  <select
    v-model="current_locale"
    @change="changeLang"
    class="py-2 pr-0 rounded-md focus:outline-none border px-3 text-sm cursor-pointer"
  >
    <option
      v-for="(lang, key) of SELECT_LANG"
      :value="key"
    >
      {{ lang.title }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { computed } from 'vue'

/**option ngôn ngữ */
interface ILang {
  /**tiêu đề */
  title: string
}

/**tiếng việt */
const vn: ILang = { title: 'Tiếng Việt' }
/**tiếng anh */
const en: ILang = { title: 'English' }
/**tiếng thái */
const th: ILang = { title: 'ไทย' }

/**mảng ngôn ngữ */
const SELECT_LANG = { vn, en, th }

/**một ngôn ngữ có nhiều kiểu viết tắt, nên phải mapping lại */
const MAPPING_LANG: { [index: string]: string } = {
  vn: 'vn',
  vi: 'vn',
  en: 'en',
  us: 'en',
  th: 'th',
}

const current_locale = computed(() => MAPPING_LANG['en'])

/**lưu lại lang mới vào local, và reload lại trang */
function changeLang($event: Event) {
  const { value: LANG } = $event.target as HTMLSelectElement

  // reload lại trang
  window.location.reload()
}
</script>
