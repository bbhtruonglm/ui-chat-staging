import type { App } from 'vue'
import type { Cb } from '@/service/interface/function'

import { i18n } from '@/lang'

export const loadLanguage = (APP: App, proceed: Cb) => {
    APP.use(i18n)

    proceed()
}