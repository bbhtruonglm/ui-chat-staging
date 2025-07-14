/**
 * i18n cho vue
 *
 * cú pháp:
 * - với <template>*</template>
 * {{ $t('v1.common.ghtk') }}
 *
 * - với <script setup>*</script>
 * import { useI18n } from 'vue-i18n'
 * const { t: $t } = useI18n()
 * return $t('v1.common.ghtk')
 *
 * - với các file script ngoài vue component
 * import { i18n } from '@/lang'
 * const { t: $t } = i18n.global
 * return $t('v1.common.ghtk')
 */

import { createI18n } from 'vue-i18n'
import { LocaleSingleton } from '@/utils/helper/Locale'

import vn from '@/lang/vn'
import en from '@/lang/en'
import th from '@/lang/th'

// init i18n
export const i18n = createI18n({
  legacy: false,
  locale: LocaleSingleton.getInst().get(),
  fallbackLocale: 'vnxxxxx',
  // fallbackLocale: 'vn',
  messages: {
    vn,
    vi: vn,
    en,
    us: en,
    th,
  },
  // tắt cảnh báo nếu không tìm thấy key
  missing: (locale, key) => undefined,
  // tắt cảnh báo nếu không tìm thấy fallback
  fallbackWarn: false,
})
